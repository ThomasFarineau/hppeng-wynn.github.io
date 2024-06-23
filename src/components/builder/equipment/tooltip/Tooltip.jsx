import {createEffect, createSignal, Show} from 'solid-js';
import './Tooltip.sass';
import {Portal} from 'solid-js/web';
import * as identifications from '../../../../generated/identifications.json';
import {builderData} from '../../../../data';
import _ from 'lodash';

const elements = {
  fire: 'Fire',
  water: 'Water',
  air: 'Air',
  thunder: 'Thunder',
  earth: 'Earth'
};

const skills = {
  strength: 'Strength',
  dexterity: 'Dexterity',
  intelligence: 'Intelligence',
  defence: 'Defence',
  agility: 'Agility'
};

export function Tooltip(props) {
  const {visible, item} = props;
  const [position, setPosition] = createSignal({x: 0, y: 0});

  const handleMouseMove = (e) => setPosition({x: e.clientX, y: e.clientY});

  createEffect(() => {
    if (visible) {
      document.addEventListener('mousemove', handleMouseMove);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
    }

    return () => document.removeEventListener('mousemove', handleMouseMove);
  });

  if (!item) {
    return null;
  }

  const skillIdentifications = {};
  const otherIdentifications = {};

  _.reduce(
    identifications,
    (result, v, k) => {
      const skillKey = k.replace('raw', '').toLowerCase();
      if (item.identifications[k]) {
        if (skills[skillKey] !== undefined) {
          skillIdentifications[k] = v;
        } else {
          otherIdentifications[k] = v;
        }
      }
      return result;
    },
    {}
  );

  return (
    <Portal>
      <div
        class="item-tooltip"
        style={{
          position: 'absolute',
          left: `${position().x}px`,
          top: `${position().y}px`,
          transform: 'translate(10px, 10px)' // Offset the tooltip slightly from the cursor
        }}
      >
        <div class={'content'}>
          <div>
            <p class={`name ${item.tier}`}>{item.name}</p>
            {item.attackSpeed && (
              <p class="attack-speed mccolor-gray">
                {item.attackSpeed} Attack Speed
              </p>
            )}
          </div>
          <div>
            {item.base.health && (
              <p class="mccolor-dark_red">
                ❤ Health:{' '}
                {item.base.health > 0
                  ? `+${item.base.health}`
                  : item.base.health}
              </p>
            )}

            {item.base.neutralDefence && (
              <p class="mccolor-gold">
                {builderData.icons.neutral} Neutral Defence:{' '}
                {item.base.neutralDefence > 0
                  ? `+${item.base.neutralDefence}`
                  : item.base.neutralDefence}
              </p>
            )}

            {Object.keys(elements).map(
              (key) =>
                item.base[`${key}Defence`] && (
                  <p class="mccolor-gray">
                    <span class={`mccolor-${key}`}>
                      {builderData.icons[key]} {elements[key]}
                    </span>{' '}
                    Defence:{' '}
                    {item.base[`${key}Defence`] > 0
                      ? `+${item.base[`${key}Defence`]}`
                      : item.base[`${key}Defence`]}
                  </p>
                )
            )}

            {item.base.damage && (
              <p class="mccolor-gold">
                {builderData.icons.neutral} Neutral Damage:{' '}
                {item.base.damage.min}-{item.base.damage.max}
              </p>
            )}

            {Object.keys(elements).map(
              (key) =>
                item.base[`${key}Damage`] && (
                  <p class="mccolor-gray">
                    <span class={`mccolor-${key}`}>
                      {builderData.icons[key]} {elements[key]}
                    </span>{' '}
                    Damage: {item.base[`${key}Damage`].min}-
                    {item.base[`${key}Damage`].max}
                  </p>
                )
            )}

            {item.base.averageDPS && (
              <p class="averageDPS mccolor-dark_gray">
                Average DPS:{' '}
                <span class={'mccolor-gray'}>{item.base.averageDPS}</span>
              </p>
            )}
          </div>

          <div>
            {item.requirements.quest && (
              <p class="mccolor-gray">
                <span class={'mccolor-green'}>✓</span> Quest Req:{' '}
                {item.requirements.quest}
              </p>
            )}
            {item.requirements.level && (
              <p class="mccolor-gray">
                <span class={'mccolor-green'}>✓</span> Combat Lv. Min:{' '}
                {item.requirements.level}
              </p>
            )}
            {Object.keys(skills).map(
              (key) =>
                item.requirements[key] && (
                  <p class="mccolor-gray">
                    <span class={'mccolor-green'}>✓</span> {skills[key]} Min:{' '}
                    {item.requirements[key]}
                  </p>
                )
            )}
          </div>

          <Show when={_.size(skillIdentifications) > 0}>
            <div>
              {_.map(skillIdentifications, (v, k) => (
                <p class="mccolor-gray">
                  {Number(item.identifications[k]) <= 0 ? (
                    <span class={'mccolor-red'}>{item.identifications[k]}</span>
                  ) : (
                    <span class={'mccolor-green'}>
                      +{item.identifications[k]}
                    </span>
                  )}{' '}
                  {v}
                </p>
              ))}
            </div>
          </Show>

          <Show when={_.size(otherIdentifications) > 0}>
            <div>
              {_.map(otherIdentifications, (v, k) =>
                _.has(item.identifications[k], 'raw') &&
                _.has(item.identifications[k], 'min') &&
                _.has(item.identifications[k], 'max') ? (
                  <p class="mccolor-gray">
                    {Number(item.identifications[k].raw) > 0 ? (
                      <span class={'mccolor-green'}>
                        +{item.identifications[k].raw}%
                      </span>
                    ) : (
                      <span class={'mccolor-red'}>
                        {item.identifications[k].raw}%
                      </span>
                    )}{' '}
                    <span class={'mccolor-dark_gray'}>
                      ({item.identifications[k].min}% to{' '}
                      {item.identifications[k].max}%){' '}
                    </span>
                    {v()}
                  </p>
                ) : (
                  <p class="mccolor-gray">
                    {Number(item.identifications[k]) > 0 ? (
                      <span class={'mccolor-green'}>
                        +{item.identifications[k]}
                      </span>
                    ) : (
                      <span class={'mccolor-red'}>
                        {item.identifications[k]}
                      </span>
                    )}{' '}
                    {v()}
                  </p>
                )
              )}
            </div>
          </Show>

          <div>
            {item.powderSlots && (
              <p class={`mccolor-gray`}>[0/{item.powderSlots}] Powder Slots</p>
            )}
            <p class={`tier ${item.tier}`}>{item.tier} Item</p>
          </div>
        </div>
        {item.lore && <p class="lore mccolor-dark_gray">{item.lore}</p>}
      </div>
    </Portal>
  );
}
