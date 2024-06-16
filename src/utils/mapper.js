
import {items, sets} from './database-loader';
import {itemTypes} from "../data";

export function init_maps() {
    let itemLists = new Map();

    for (const it of itemTypes) {
        itemLists.set(it, []);
    }

    let itemMap = new Map();
    let idMap = new Map();
    let redirectMap = new Map();

    for (const item of items) {
        if (item.remapID === undefined) {
            console.log(item.id)
            itemLists.get(item.type).push(item.displayName);
            itemMap.set(item.displayName, item);
            idMap.set(item.id, item.displayName);
        } else {
            redirectMap.set(item.id, item.remapID);
        }
    }
/*
    for (const [set_name, set_data] of sets) {
        for (const item_name of set_data.items) {
            itemMap.get(item_name).set = set_name;
        }
    }

 */

    console.log(idMap);
}
