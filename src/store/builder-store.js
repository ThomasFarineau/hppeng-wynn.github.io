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
  bonusSkillpoints: {
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    defence: 0,
    agility: 0
  },
  mandatorySkillpoints: {
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    defence: 0,
    agility: 0
  }
});

export function storeItem(type, item) {
  if (builderData.typesStore.includes(type)) {
    setEquipmentStore('items', type, item);

    for (let bonusSkillpointsKey in equipmentStore.bonusSkillpoints) {
      const n = getBonusName(bonusSkillpointsKey);

      setEquipmentStore('bonusSkillpoints', bonusSkillpointsKey, () =>
        _.sum(
          _.map(equipmentStore.items, (item) =>
            _.get(item, `identifications.${n}`, 0)
          )
        )
      );

      setEquipmentStore('mandatorySkillpoints', bonusSkillpointsKey, () => {
        return _.max(
          _.map(equipmentStore.items, (item) =>
            _.get(item, `requirements.${bonusSkillpointsKey}`, 0)
          )
        );
      });
    }
  } else {
    throw new Error(`Invalid item type: ${type}`);
  }
}

function getBonusName(value) {
  return 'raw' + value.charAt(0).toUpperCase() + value.slice(1);
}

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
  error: null
});

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
  setSkillStore('currentTotal', _.sum(Object.values(skillStore.self)));
});

// Export combined stores
export {equipmentStore, skillStore, setSkillStore};
