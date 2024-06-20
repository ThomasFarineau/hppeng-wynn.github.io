import {createSignal, For, onCleanup, onMount, Show} from 'solid-js';
import {Portal} from 'solid-js/web';
import {searchItems} from '../../../../utils';
import './PowderModal.sass';
import {Entries} from '@solid-primitives/keyed';
import _ from 'lodash';
import {builderData, TierEnum} from '../../../../data';

export function createPowderModal() {
  const [open, setOpen] = createSignal(false);
  const [animation, setAnimation] = createSignal(false);
  let currentInput;
  let ulElement;
  const [items, setItems] = createSignal([]);

  const handleKeydown = (e) => {
    if (e.key === 'Escape') closeModal();
  };

  const handleClickOutside = (e) => {
    if (open() && !e.target.closest('.modal-body')) closeModal();
  };

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('mousedown', handleClickOutside);
    onCleanup(() => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('mousedown', handleClickOutside);
    });
  });

  const openPowderModal = () => {
    document.body.style.overflow = 'hidden';
    setOpen(true);
    setAnimation(true);
    setTimeout(() => {
      setAnimation(false);
    }, 0);
  };

  const closeModal = () => {
    setAnimation(true);
    setTimeout(() => {
      setAnimation(false);
      setOpen(false);
      document.body.style.overflow = 'auto';
    }, 350);
  };

  return {
    openPowderModal,
    PowderModal() {
      const [selectedTiers] = createSignal([]);

      const handleMouseDown = (e) => {
        if (ulElement && ulElement.contains(e.target)) {
          e.preventDefault(); // Prevent blur event
        }
      };

      return (
        <Portal>
          <Show when={open()}>
            <div class={`modal`} onMouseDown={handleMouseDown}>
              <div class={`modal-body ${animation() ? 'animation' : ''}`}>
                <h2>
                  Select a powder <span onClick={closeModal} />
                </h2>
                <div class="powder-select">
                  <label>
                    <span>Min Level</span>
                    <input
                      type="range"
                      min={1}
                      max={6}
                      value={1}
                      style={
                        'background-size: ' +
                        (Number(0) / (5 - 1)) * 100 +
                        '% 100%'
                      }
                      onInput={(e) => {
                        console.log(e.target.value);
                      }}
                    />
                  </label>
                  <span class={'tags'}>
                    <Entries of={builderData.powders}>
                      {(key, v) => {
                        console.log(v());
                        return (
                          <div
                            class={`tag ${key}`}
                            style={`background: ${v().color}`}
                          >
                            {key}
                            <span>{v().icon}</span>
                          </div>
                        );
                      }}
                    </Entries>
                  </span>
                </div>
                <div class="buttons">
                  <button>Sauvegarder</button>
                  <button onClick={closeModal}>Annuler</button>
                </div>
              </div>
            </div>
          </Show>
        </Portal>
      );
    }
  };
}
