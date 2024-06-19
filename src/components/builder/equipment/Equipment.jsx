import {createEffect, createSignal, For} from 'solid-js';
import {createModal} from './modal/Modal';
import './Equipment.sass';
import {equipmentStore, storeItem} from '../../../store';

export function Equipment(props) {
  const {type, index} = props;

  const {Modal, openModal} = createModal();
  const [item, setItem] = createSignal(null);
  const [powders, setPowders] = createSignal([]);
  const [level, setLevel] = createSignal(0);
  const [bonus, setBonus] = createSignal(0);

  let input;

  const updateItem = (item) => {
    const key = `${type}${index !== -1 ? index : ''}`;
    setItem(item);
    storeItem(key, item);
    setBonus(item.base?.health || item.base?.averageDPS || 0);
    setLevel(item.requirements?.level || 0);

    setPowders(new Array(item.powderSlots).fill(null));
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
              {(slot, i) => <div class={`powder`}>a</div>}
            </For>
          </div>
        </div>
      </div>
      <Modal input={input} type={type} setItem={updateItem} />
    </>
  );
}
