import {createSignal, For, onCleanup, onMount, Show} from 'solid-js';
import {Portal} from 'solid-js/web';
import {searchItems} from '../../../../utils';
import '../Modal.sass';
import {Entries} from '@solid-primitives/keyed';
import _ from 'lodash';
import {builderData, TierEnum} from '../../../../data';

export function createModal() {
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

  const openModal = (type, value, setItem) => {
    document.body.style.overflow = 'hidden';
    setOpen(true);
    setAnimation(true);
    setTimeout(() => {
      setAnimation(false);
      currentInput.focus();
    }, 0);
    searchItems(type, value).then((r) => setItems(r));
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
    openModal,
    Modal(props) {
      const {input, type, setItem} = props;
      const [isFocused, setIsFocused] = createSignal(false);
      const [minLevel, setMinLevel] = createSignal(0);
      const [maxLevel, setMaxLevel] = createSignal(builderData.maxLevel);
      const [powderSlots, setPowderSlots] = createSignal(-1);
      const [selectedTiers, setSelectedTiers] = createSignal([]);
      const [focusedIndex, setFocusedIndex] = createSignal(0);

      const search = (v) => {
        searchItems(type, v, {
          minLevel: Number(minLevel()),
          maxLevel: Number(maxLevel()),
          powderSlots: Number(powderSlots()),
          tiers: selectedTiers()
        }).then((r) => setItems(r));
      };

      const onInput = (e) => {
        input.value = e.target.value;
        handleFocusIn();
      };

      const onItemClick = (item) => {
        input.value = item.name;
        setItem(item);
        closeModal();
      };

      const handleMouseDown = (e) => {
        if (ulElement && ulElement.contains(e.target)) {
          e.preventDefault(); // Prevent blur event
        }
      };

      const handleBlur = (e) => {
        if (ulElement && !ulElement.contains(e.relatedTarget))
          setIsFocused(false);
      };

      const handleFocusIn = () => {
        setIsFocused(true);
        if (selectedTiers().length === 0) {
          setSelectedTiers(_.keys(TierEnum).map((k) => TierEnum[k]));
        }
        search(input.value);
      };

      const toggleTierSelection = (tier) => {
        setSelectedTiers((prev) =>
          prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
        );
        search(input.value);
      };

      function deleteItem() {
        setItem(null);
        closeModal();
      }

      function saveItem() {
        searchItems(type, input.value).then((r) => {
          if (r.length === 1 && r[0].name === input.value) {
            setItem(r[0]);
            closeModal();
          } else {
            deleteItem();
          }
        });
      }

      const handleKeyDown = (e) => {
        const itemsCount = items().length;
        if (itemsCount === 0) return;

        if (e.key === 'ArrowDown' || e.key === 'Tab') {
          e.preventDefault();
          setFocusedIndex((prev) => {
            const newIndex = (prev + 1) % itemsCount;
            scrollToItem(newIndex);
            return newIndex;
          });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setFocusedIndex((prev) => {
            const newIndex = (prev - 1 + itemsCount) % itemsCount;
            scrollToItem(newIndex);
            return newIndex;
          });
        } else if (e.key === 'Enter') {
          e.preventDefault();
          onItemClick(items()[focusedIndex()]);
        }
      };

      const scrollToItem = (index) => {
        const itemElement = ulElement.children[index];
        if (itemElement) {
          const padding = 8; // 0.5rem in pixels
          const ulRect = ulElement.getBoundingClientRect();
          const itemRect = itemElement.getBoundingClientRect();

          if (itemRect.top < ulRect.top + padding) {
            ulElement.scrollTop -= ulRect.top - itemRect.top + padding;
          } else if (itemRect.bottom > ulRect.bottom - padding) {
            ulElement.scrollTop += itemRect.bottom - ulRect.bottom + padding;
          }
        }
      };

      return (
        <Portal>
          <Show when={open()}>
            <div class={`modal`} onMouseDown={handleMouseDown}>
              <div
                class={`modal-body ${animation() ? 'animation' : ''}`}
                onKeyDown={handleKeyDown}
              >
                <h2>
                  Select a {type} <span onClick={closeModal} />
                </h2>
                <div class="filters">
                  <label>
                    <span>
                      Min Level <span>{minLevel()}</span>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={builderData.maxLevel - 1}
                      value={minLevel()}
                      style={
                        'background-size: ' +
                        (Number(minLevel()) / (builderData.maxLevel - 1)) *
                          100 +
                        '% 100%'
                      }
                      onInput={(e) => {
                        setMinLevel(Number(e.target.value));
                        if (maxLevel() <= e.target.value)
                          setMaxLevel(Number(e.target.value) + 1);
                      }}
                    />
                  </label>
                  <label>
                    <span>
                      Max Level <span>{maxLevel()}</span>
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={builderData.maxLevel}
                      value={maxLevel()}
                      style={
                        'background-size: ' +
                        (Number(maxLevel()) / builderData.maxLevel) * 100 +
                        '% 100%'
                      }
                      onInput={(e) => {
                        setMaxLevel(Number(e.target.value));
                        if (minLevel() >= Number(e.target.value))
                          setMinLevel(Number(e.target.value) - 1);
                      }}
                    />
                  </label>
                  <label>
                    <span>
                      Powder Slots <span>{powderSlots()}</span>
                    </span>
                    <input
                      type="range"
                      min={-1}
                      max={builderData.maxPowderSlots}
                      style={
                        'background-size: ' +
                        ((Number(powderSlots()) + 1) /
                          (builderData.maxPowderSlots + 1)) *
                          100 +
                        '% 100%'
                      }
                      value={powderSlots()}
                      onInput={(e) => setPowderSlots(e.target.value)}
                    />
                  </label>
                  <span class={'tags'}>
                    <Entries of={TierEnum}>
                      {(key, v) => (
                        <div
                          class={`tag ${v()} ${selectedTiers().includes(v()) ? 'selected' : ''}`}
                          onClick={() => toggleTierSelection(v())}
                        >
                          {v()} <span></span>
                        </div>
                      )}
                    </Entries>
                  </span>
                </div>
                <div class="search">
                  <input
                    value={input.value}
                    ref={(el) => (currentInput = el)}
                    onInput={onInput}
                    onFocusIn={handleFocusIn}
                    onBlur={handleBlur}
                  />
                  <ul
                    ref={(el) => (ulElement = el)}
                    class={isFocused() && items().length > 0 ? '' : 'hidden'}
                  >
                    <For each={items()}>
                      {(item, index) => (
                        <li
                          class={`${item.tier} ${index() === focusedIndex() ? 'focused' : ''}`}
                          onClick={() => onItemClick(item)}
                        >
                          <div class={`icon ${item.type}`}></div>
                          {item.name}
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
                <div class="buttons">
                  <button onClick={deleteItem}>Delete</button>
                  <button onClick={saveItem}>Save</button>
                </div>
              </div>
            </div>
          </Show>
        </Portal>
      );
    }
  };
}
