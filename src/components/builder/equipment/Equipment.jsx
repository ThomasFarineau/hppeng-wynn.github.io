import {createEffect, createSignal, For} from 'solid-js';
import {createModal} from './modal/Modal';
import {createPowderModal} from './powder-modal/PowderModal';
import './Equipment.sass';
import {equipmentStore, storeItem} from '../../../store';
import {builderData} from '../../../data';

export function Equipment(props) {
  const {type, index} = props;

  const {Modal, openModal} = createModal();
  const {PowderModal, openPowderModal} = createPowderModal();

  const [item, setItem] = createSignal(null);
  const [powders, setPowders] = createSignal([]);
  const [level, setLevel] = createSignal(0);
  const [bonus, setBonus] = createSignal(0);

  let input;

  const updateItem = (item) => {
    const key = `${type}${index !== -1 ? index : ''}`;
    if (item === null) {
      setItem(null);
      storeItem(key, null);
      setBonus(0);
      setLevel(0);
      setPowders([]);
    } else {
      setItem(item);
      storeItem(key, item);
      setBonus(item.base?.health || item.base?.averageDPS || 0);
      setLevel(item.requirements?.level || 0);

      setPowders(new Array(item.powderSlots).fill(null));
    }
  };

  createEffect(() => {
    const key = `${type}${index !== -1 ? index : ''}`;
    const storedItem = equipmentStore.items[key];
    if (storedItem) {
      setItem(storedItem);
      setBonus(storedItem.base?.health || storedItem.base?.averageDPS || 0);
      setLevel(storedItem.requirements?.level || 0);

      setPowders(new Array(storedItem.powderSlots).fill(null));
    }
  });

  return (
    <>
      <div
        class={`equipment ${item() ? item().type : type} ${item() ? item().tier : ''}`}
      >
        <div class="icon"></div>
        <div class="info">
          <span class="bonus">{bonus()}</span>
          <span class="level">{level()}</span>
        </div>
        <div class="item">
          <input
            ref={input}
            value={item() ? item().name : ''}
            type="text"
            onFocusIn={(e) => openModal(type, e.target.value, updateItem)}
          />
          <div class="powders">
            <For each={powders()}>
              {() => (
                <div
                  onClick={(e) => openPowderModal()}
                  class={`powder`}
                  style={`color: ${builderData.powders.air.color}`}
                >
                  <div class="icon">{builderData.powders.air.icon}</div>
                  <span>IV</span>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
      <Modal input={input} type={type} setItem={updateItem} />
      <PowderModal />
    </>
  );
}
