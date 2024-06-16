import {createStore} from "solid-js/store";
import {createSignal} from "solid-js";
import _ from "lodash";
import * as data from "../data";

const itemType = ['weapon', 'ring1', 'ring2', 'bracelet', 'necklace', 'helmet', 'chestplate', 'leggings', 'boots'];

const [equipmentStore, setEquipmentStore] = createStore({
    items: {
        weapon: null,
        ring1: null,
        ring2: null,
        bracelet: null,
        necklace: null,
        helmet: null,
        chestplate: null,
        leggings: null,
        boots: null,
    }, bonus: {
        strength: 0, dexterity: 0, intelligence: 0, defence: 0, agility: 0
    }, mandatory: {
        strength: 0, dexterity: 0, intelligence: 0, defence: 0, agility: 0
    }
});

const [bonusAndMandatorySignal, setBonusAndMandatorySignal] = createSignal({
    bonus: equipmentStore.bonus,
    mandatory: equipmentStore.mandatory
});

export function storeItem(type, item) {
    if (itemType.includes(type)) {
        setEquipmentStore("items", (prev) => {
            return {...prev, [type]: item}
        });
        updateBonusAndMandatory();
    } else {
        throw new Error(`Invalid item type: ${type}`);
    }
}

function updateBonusAndMandatory() {
    const newBonus = _.mapValues(equipmentStore.bonus, () => 0);
    const newMandatory = _.mapValues(equipmentStore.mandatory, () => 0);

    _.map(equipmentStore.items, (item, key) => _.map(equipmentStore.bonus, (value, key) => newBonus[key] += _.get(item, `identifications.${getBonusName(key)}`, 0)))

    _.map(equipmentStore.mandatory, (value, key) => newMandatory[key] += _.max(_.map(equipmentStore.items, (item) => {
        console.log(item)
        return _.get(item, `requirements.${key}`, 0);
    })));


    setEquipmentStore("bonus", newBonus);
    setEquipmentStore("mandatory", newMandatory);
    setBonusAndMandatorySignal({
        bonus: newBonus,
        mandatory: newMandatory
    });
}

function getBonusName(value) {
    return "raw" + value.charAt(0).toUpperCase() + value.slice(1);
}

export {
    equipmentStore, bonusAndMandatorySignal
};


