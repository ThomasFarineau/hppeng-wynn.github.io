import {createSignal, onCleanup, onMount, Show} from 'solid-js';
import {Portal} from 'solid-js/web';
import '../Modal.sass';
import {Entries} from '@solid-primitives/keyed';
import {builderData} from '../../../../data';

export function createPowderModal() {
  const [open, setOpen] = createSignal(false);
  const [animation, setAnimation] = createSignal(false);
  const [selectedPowder, setSelectedPowder] = createSignal(null);
  const [selectedLevel, setSelectedLevel] = createSignal(1); // [1, 6]
  let ulElement;

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

  const openPowderModal = (powder) => {
    document.body.style.overflow = 'hidden';
    setOpen(true);
    setAnimation(true);
    if (powder) {
      setSelectedPowder(powder.type);
      setSelectedLevel(powder.level);
    }
    setTimeout(() => setAnimation(false), 0);
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
      const handleMouseDown = (e) => {
        if (ulElement && ulElement.contains(e.target)) {
          e.preventDefault(); // Prevent blur event
        }
      };

      return (
        <Portal>
          <Show when={open()}>
            <div class="modal" onMouseDown={handleMouseDown}>
              <div class={`modal-body ${animation() ? 'animation' : ''}`}>
                <h2>
                  Select a powder <span onClick={closeModal} />
                </h2>
                <div class="powder-select">
                  <label>
                    <span>Powder level</span>
                    <input
                      type="range"
                      min={1}
                      max={6}
                      value={selectedLevel()}
                      style={{
                        'background-size': `${((selectedLevel() - 1) / 5) * 100}% 100%`
                      }}
                      onInput={(e) => setSelectedLevel(Number(e.target.value))}
                    />
                  </label>
                  <span class="tags powders">
                    <Entries of={builderData.powders}>
                      {(key, v) => (
                        <div
                          class={`tag ${key} ${selectedPowder() === key ? 'selected' : ''}`}
                          onClick={() => setSelectedPowder(key)}
                        >
                          {key}
                          <span>{builderData.icons[key]}</span>
                        </div>
                      )}
                    </Entries>
                  </span>
                </div>
                <div class="buttons">
                  <button onClick={closeModal}>Cancel</button>
                  <button>Save</button>
                </div>
              </div>
            </div>
          </Show>
        </Portal>
      );
    }
  };
}
