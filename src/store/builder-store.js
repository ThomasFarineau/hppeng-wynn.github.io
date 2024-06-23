import {createStore} from 'solid-js/store';
import _ from 'lodash';
import {builderData} from '../data';
import {createEffect} from 'solid-js';

// Equipment Store
const [equipmentStore, setEquipmentStore] = createStore({
  items: {
    weapon: null,
    helmet: null,
    chestplate: null,
    leggings: null,
    boots: null,
    bracelet: null,
    necklace: null,
    ring1: null,
    ring2: null
  },
  powdering: {
    weapon: [],
    helmet: [],
    chestplate: [],
    leggings: [],
    boots: []
  }
});

// Skill Store
const [skillStore, setSkillStore] = createStore({
  currentTotal: 0,
  maxPoints: 0,
  value: {
    agility: 0,
    intelligence: 0,
    strength: 0,
    dexterity: 0,
    defense: 0
  },
  self: {
    agility: 0,
    intelligence: 0,
    strength: 0,
    dexterity: 0,
    defense: 0
  },
  bonus: {
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    defence: 0,
    agility: 0
  },
  mandatory: {
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    defence: 0,
    agility: 0
  },
  error: null
});

function updateBonusSkillpoints(key, name) {
  setSkillStore('bonus', key, () => {
    let v = 0;
    _.forEach(equipmentStore.items, (item) => {
      if (item === null) return;
      v += _.get(item, `identifications.${name}`, 0);
    });

    return v;
  });
}

function updateMandatorySkillpoints(key) {
  setSkillStore('mandatory', key, () => {
    let max = 0;
    _.forEach(equipmentStore.items, (item) => {
      if (item === null) return;
      max = Math.max(max, _.get(item, `requirements.${key}`, 0));
    });

    return max;
  });
}

function updatePowdering(type, item) {
  if (equipmentStore.powdering[type] !== undefined) {
    const newSlotCount = item ? Number(item.powderSlots) : 0;

    // Ensure newSlotCount is a non-negative integer
    const validNewSlotCount =
      Number.isInteger(newSlotCount) && newSlotCount >= 0 ? newSlotCount : 0;

    if (_.has(equipmentStore.powdering, type)) {
      const currentPowderings = equipmentStore.powdering[type];
      const currentSlotCount = currentPowderings.length;

      if (validNewSlotCount > currentSlotCount) {
        // Add new slots if the new item has more slots
        const additionalSlots = Array(
          validNewSlotCount - currentSlotCount
        ).fill(null);
        setEquipmentStore('powdering', type, [
          ...currentPowderings,
          ...additionalSlots
        ]);
      } else if (validNewSlotCount < currentSlotCount) {
        setEquipmentStore(
          'powdering',
          type,
          currentPowderings.slice(0, validNewSlotCount)
        );
      } else {
        setEquipmentStore('powdering', type, currentPowderings);
      }
    } else {
      setEquipmentStore('powdering', type, Array(validNewSlotCount).fill(null));
    }
  }
}

export function storeItem(type, item) {
  if (_.includes(builderData.typesStore, type)) {
    setEquipmentStore('items', type, item);
    for (let key in skillStore.value) {
      updateBonusSkillpoints(key, getBonusName(key));
      updateMandatorySkillpoints(key);
    }
    updatePowdering(type, item);
  } else {
    throw new Error(`Invalid item type: ${type}`);
  }
}

export function storePowdering(powdering) {
  _.forEach(powdering, (value, key) => {
    _.forEach(value, (v, i) => {
      if (_.has(equipmentStore.powdering, [key, i])) {
        setEquipmentStore('powdering', key, (prev) => {
          const updated = _.cloneDeep(prev);
          updated[i] = v;

          return updated;
        });
      }
    });
  });
}

export function storeEquipments(equipments) {
  _.forEach(equipments, (value, key) => storeItem(key, value));
}

export function storeSkillPoints(skillPoints) {
  _.forEach(skillPoints, (value, i) =>
    setSkillStore('value', builderData.skills[i].id, value)
  );
}

function getBonusName(value) {
  return 'raw' + _.capitalize(value);
}

export function setError(error) {
  setSkillStore('error', error);
}

export function setMaxPoints(points) {
  setSkillStore('maxPoints', points);
}

export function setCurrentTotal(total) {
  setSkillStore('currentTotal', total);
}

createEffect(() => {
  setSkillStore('currentTotal', _.sum(_.values(skillStore.self)));
});

// Export combined stores
export {equipmentStore, skillStore, setSkillStore};
