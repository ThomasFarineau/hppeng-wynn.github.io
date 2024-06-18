import * as database from '../generated/output.json';
import _ from 'lodash';

export let items = [];

export let sets = new Map();

export async function load() {
  try {
    const shouldClean = await checkDatabaseSize();
    if (shouldClean) {
      await clean();
      await createItemDatabase();
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

const createItemDatabase = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open('wynncraft-data', 1);
    req.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('items')) {
        db.createObjectStore('items', {keyPath: 'id'});
      }
      if (!db.objectStoreNames.contains('recipes')) {
        db.createObjectStore('recipes', {keyPath: 'name'});
      }
      if (!db.objectStoreNames.contains('sets')) {
        db.createObjectStore('sets', {keyPath: 'name'});
      }

      const transaction = event.target.transaction;
      transaction.oncomplete = () => {
        console.log('Object stores created successfully');
        resolve();
      };
      transaction.onerror = () => {
        console.error('Error creating object stores');
        reject(transaction.error);
      };
    };
    req.onsuccess = () => {
      console.log('Database opened successfully');
      resolve();
    };
    req.onerror = () => {
      console.error('Error opening database');
      reject(req.error);
    };
  });

function getItems() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('wynncraft-data', 1);
    req.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction('items', 'readonly');
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
      reqCursor.onerror = () => {
        reject(reqCursor.error);
      };
    };
    req.onerror = () => {
      reject(req.error);
    };
  });
}

function getSets() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('wynncraft-data', 1);
    req.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction('sets', 'readonly');
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
      reqCursor.onerror = () => {
        reject(reqCursor.error);
      };
    };
    req.onerror = () => {
      reject(req.error);
    };
  });
}

function fillIndexedDatabase() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('wynncraft-data', 1);
    req.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction(['items', 'recipes', 'sets'], 'readwrite');
      const itemStore = tx.objectStore('items');
      const recipeStore = tx.objectStore('recipes');
      const setStore = tx.objectStore('sets');

      // Add items
      _.forOwn(database.items, (item, key) => {
        item.id = Number(key);
        itemStore.put(item);
      });

      // Add recipes
      _.forOwn(database.recipes, (recipe, key) => {
        recipe.name = key;
        recipeStore.put(recipe);
      });

      // Create sets
      const sets = {};
      _.forOwn(database.items, (item, key) => {
        if (item.tier === 'set') {
          if (item.setName !== undefined && !sets[item.setName]) {
            sets[setName] = {name: item.setName, items: []};
          }
          sets[item.setName].items.push(key);
        }
      });

      // Add sets
      _.forOwn(sets, (set) => {
        setStore.put(set);
      });

      tx.oncomplete = () => {
        console.log('All items, recipes, and sets added successfully');
        resolve();
      };
      tx.onerror = () => {
        console.error('Error adding items, recipes, and sets');
        reject(tx.error);
      };
    };
    req.onerror = () => {
      console.error('Error opening database');
      reject(req.error);
    };
  });
}

function checkDatabaseSize() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('wynncraft-data', 1);
    let databaseExists = true;

    req.onupgradeneeded = (event) => {
      // Database does not exist yet
      databaseExists = false;
      const db = event.target.result;
      db.createObjectStore('items', {keyPath: 'name'});
      db.createObjectStore('recipes', {keyPath: 'name'});
      db.createObjectStore('sets', {keyPath: 'name'});
    };

    req.onsuccess = (event) => {
      if (!databaseExists) {
        // If database does not exist, it needs to be filled
        resolve(true);

        return;
      }

      const db = event.target.result;

      const checkItemCount = new Promise((resolve, reject) => {
        const itemCountReq = db
          .transaction('items', 'readonly')
          .objectStore('items')
          .count();
        itemCountReq.onsuccess = () => {
          resolve(itemCountReq.result);
        };
        itemCountReq.onerror = () => {
          reject(itemCountReq.error);
        };
      });

      const checkRecipeCount = new Promise((resolve, reject) => {
        const recipeCountReq = db
          .transaction('recipes', 'readonly')
          .objectStore('recipes')
          .count();
        recipeCountReq.onsuccess = () => {
          resolve(recipeCountReq.result);
        };
        recipeCountReq.onerror = () => {
          reject(recipeCountReq.error);
        };
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
