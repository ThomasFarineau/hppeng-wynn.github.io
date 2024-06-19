import {builderData, TierEnum, TypeEnum} from '../data';

export async function searchItems(type, name, config = {}) {
  const defaultConfig = {
    minLevel: 0,
    maxLevel: builderData.maxLevel,
    powderSlots: -1,
    tiers: [
      TierEnum.NORMAL,
      TierEnum.UNIQUE,
      TierEnum.SET,
      TierEnum.RARE,
      TierEnum.LEGENDARY,
      TierEnum.FABLED,
      TierEnum.MYTHIC
    ]
  };
  const searchConfig = {...defaultConfig, ...config};

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
          const item = cursor.value;
          if (matchesCriteria(item, type, name, searchConfig)) {
            items.push(item);
          }
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

function matchesCriteria(item, type, name, config) {
  return (
    matchesType(item, type) &&
    matchesName(item, name) &&
    matchesLevel(item, config.minLevel, config.maxLevel) &&
    matchesPowderSlots(item, config.powderSlots) &&
    matchesTier(item, config.tiers)
  );
}

function matchesType(item, type) {
  return type === TypeEnum.WEAPON
    ? builderData.types.weapon.includes(item.type)
    : item.type === type;
}

function matchesName(item, name) {
  return !name || item.name.toLowerCase().includes(name.toLowerCase());
}

function matchesLevel(item, minLevel, maxLevel) {
  return (
    item.requirements?.level >= minLevel && item.requirements.level <= maxLevel
  );
}

function matchesPowderSlots(item, powderSlots) {
  return powderSlots === -1 || item.powderSlots === powderSlots;
}

function matchesTier(item, tiers) {
  if (tiers.length === 0) return false;

  return tiers.includes(item.tier);
}

export function getItemByID(id) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('wynncraft-data', 1);
    req.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction('items', 'readonly');
      const store = tx.objectStore('items');

      const reqItem = store.get(id);
      reqItem.onsuccess = () => {
        resolve(reqItem.result);
      };
      reqItem.onerror = () => {
        reject(reqItem.error);
      };
    };
    req.onerror = () => {
      reject(req.error);
    };
  });
}
