import {createEffect, createSignal, For} from 'solid-js';
import {createModal} from './modal/Modal';
import {createPowderModal} from './powder-modal/PowderModal';
import './Equipment.sass';
import {equipmentStore, storeItem} from '../../../store';
import {builderData} from '../../../data';
import {Tooltip} from './tooltip/Tooltip';

export function Equipment(props) {
  const {type, index} = props;

  const {Modal, openModal} = createModal();
  const {PowderModal, openPowderModal} = createPowderModal();

  const [item, setItem] = createSignal(null);
  const [level, setLevel] = createSignal(0);
  const [bonus, setBonus] = createSignal(0);
  const [showTooltip, setShowTooltip] = createSignal(false);
  let input;

  const updateItem = (item) => {
    const key = `${type}${index !== -1 ? index : ''}`;
    if (item === null) {
      setItem(null);
      storeItem(key, null);
      setBonus(0);
      setLevel(0);
    } else {
      setItem(item);
      storeItem(key, item);
      setBonus(item.base?.health || item.base?.averageDPS || 0);
      setLevel(item.requirements?.level || 0);
    }
  };

  createEffect(() => {
    const key = `${type}${index !== -1 ? index : ''}`;
    const storedItem = equipmentStore.items[key];
    if (storedItem) {
      setItem(storedItem);
      setBonus(storedItem.base?.health || storedItem.base?.averageDPS || 0);
      setLevel(storedItem.requirements?.level || 0);
    }
  });

  function toRoman(level) {
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return roman[level - 1];
  }

  return (
    <>
      {showTooltip() && <Tooltip visible={showTooltip()} item={item()} />}
      <div
        class={`equipment ${item() ? item().type : type} ${item() ? item().tier : ''}`}
      >
        <div
          class="icon"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        ></div>
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
          {equipmentStore.powdering[type] !== undefined && (
            <div class="powders">
              <For each={equipmentStore.powdering[type]}>
                {(t, i) =>
                  t === null ? (
                    <div
                      onClick={(e) =>
                        openPowderModal(equipmentStore.powdering[type][i()])
                      }
                      class={`powder empty`}
                    ></div>
                  ) : (
                    <div
                      onClick={(e) =>
                        openPowderModal(equipmentStore.powdering[type][i()])
                      }
                      className={`powder`}
                      style={`color: ${builderData.powders[t.type].color}`}
                    >
                      <div className="icon">{builderData.icons[t.type]}</div>
                      <span>{toRoman(t.level)}</span>
                    </div>
                  )
                }
              </For>
            </div>
          )}
        </div>
      </div>
      <Modal input={input} type={type} setItem={updateItem} />
      <PowderModal />
    </>
  );
}
