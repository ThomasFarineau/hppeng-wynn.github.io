import * as database from '../generated/output.json';
import _ from 'lodash';

export let items = [];

export let sets = new Map();

export async function load() {
  try {
    const shouldClean = await checkDatabaseSize();
    if (shouldClean) {
      await clean();
      await createDatabase();
      await fillIndexedDatabase();
    } else {
      items = await getItems();
      sets = await getSets();
      console.log('Database is already up-to-date. No need to reload.');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('wynncraft-data', 1);
    req.onsuccess = (event) => resolve(event.target.result);
    req.onerror = () => reject(req.error);
  });
}

function createObjectStores(db) {
  const storeNames = ['items', 'recipes', 'sets'];
  storeNames.forEach((store) => {
    if (!db.objectStoreNames.contains(store)) {
      db.createObjectStore(store, {keyPath: store === 'items' ? 'id' : 'name'});
    }
  });
}

function performTransaction(stores, mode, action) {
  return openDatabase().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(stores, mode);
      action(tx)
        .then(() => resolve())
        .catch((error) => reject(error));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  });
}

function clean() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase('wynncraft-data');
    req.onsuccess = () => {
      console.log('Database deleted successfully');
      resolve();
    };
    req.onerror = () => {
      console.error('Error deleting database');
      reject(req.error);
    };
  });
}

const createDatabase = () => {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('wynncraft-data', 1);
    req.onupgradeneeded = (event) => {
      createObjectStores(event.target.result);
      resolve();
    };
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

function getItems() {
  return performTransaction(['items'], 'readonly', (tx) => {
    return new Promise((resolve, reject) => {
      const store = tx.objectStore('items');
      const items = [];
      const reqCursor = store.openCursor();
      reqCursor.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          items.push(cursor.value);
          cursor.continue();
        } else {
          resolve(items);
        }
      };
      reqCursor.onerror = () => reject(reqCursor.error);
    });
  });
}

function getSets() {
  return performTransaction(['sets'], 'readonly', (tx) => {
    return new Promise((resolve, reject) => {
      const store = tx.objectStore('sets');
      const sets = new Map();
      const reqCursor = store.openCursor();
      reqCursor.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          sets.set(cursor.value.name, cursor.value);
          cursor.continue();
        } else {
          resolve(sets);
        }
      };
      reqCursor.onerror = () => reject(reqCursor.error);
    });
  });
}

function fillIndexedDatabase() {
  return performTransaction(['items', 'recipes', 'sets'], 'readwrite', (tx) => {
    return new Promise((resolve, reject) => {
      const itemStore = tx.objectStore('items');
      const recipeStore = tx.objectStore('recipes');
      const setStore = tx.objectStore('sets');

      _.forOwn(database.items, (item, key) => {
        item.id = Number(key);
        itemStore.put(item);
      });

      _.forOwn(database.recipes, (recipe, key) => {
        recipe.name = key;
        recipeStore.put(recipe);
      });

      const sets = {};
      _.forOwn(database.items, (item, key) => {
        if (item.tier === 'set') {
          if (item.setName !== undefined && !sets[item.setName]) {
            sets[item.setName] = {name: item.setName, items: []};
          }
          sets[item.setName].items.push(key);
        }
      });

      _.forOwn(sets, (set) => {
        setStore.put(set);
      });

      tx.oncomplete = () => {
        console.log('All items, recipes, and sets added successfully');
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  });
}

function checkDatabaseSize() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('wynncraft-data', 1);
    let databaseExists = true;

    req.onupgradeneeded = (event) => {
      databaseExists = false;
      createObjectStores(event.target.result);
    };

    req.onsuccess = (event) => {
      if (!databaseExists) {
        resolve(true);

        return;
      }

      const db = event.target.result;

      const checkItemCount = new Promise((resolve, reject) => {
        const itemCountReq = db
          .transaction('items', 'readonly')
          .objectStore('items')
          .count();
        itemCountReq.onsuccess = () => resolve(itemCountReq.result);
        itemCountReq.onerror = () => reject(itemCountReq.error);
      });

      const checkRecipeCount = new Promise((resolve, reject) => {
        const recipeCountReq = db
          .transaction('recipes', 'readonly')
          .objectStore('recipes')
          .count();
        recipeCountReq.onsuccess = () => resolve(recipeCountReq.result);
        recipeCountReq.onerror = () => reject(recipeCountReq.error);
      });

      Promise.all([checkItemCount, checkRecipeCount])
        .then(([itemCount, recipeCount]) => {
          const databaseItemCount = _.size(database.items);
          const databaseRecipeCount = _.size(database.recipes);
          resolve(
            itemCount !== databaseItemCount ||
              recipeCount !== databaseRecipeCount
          );
        })
        .catch((error) => {
          console.error('Error counting items or recipes in database');
          reject(error);
        });
    };

    req.onerror = () => {
      console.error('Error opening database');
      reject(req.error);
    };
  });
}
