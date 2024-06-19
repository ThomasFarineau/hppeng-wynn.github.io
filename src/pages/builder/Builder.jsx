import './Builder.sass';
import {Equipment, Header, Skill} from '../../components/builder';
import {createSignal, For} from 'solid-js';
import {builderData} from '../../data';
import {decodeHash, processURI} from '../../utils';
import {Entries} from '@solid-primitives/keyed';
import {setSkillValue, storeItem} from '../../store';
import _ from 'lodash';

export default function Builder() {
  const getSkillPoints = (level) =>
    level < 1
      ? 0
      : level > builderData.maxLevelSkillPoint
        ? 200
        : (level - 1) * 2;
  let level = 0;
  const [levelValue, setLevelValue] = createSignal(level);
  const setLevel = (value) => {
    setLevelValue(
      Math.min(
        Math.max(isNaN(parseInt(value)) ? 1 : parseInt(value), 1),
        builderData.maxLevel
      )
    );
  };

  processURI();
  decodeHash(localStorage.getItem('v'), localStorage.getItem('hash')).then(
    (data) => {
      setLevelValue(data.level);
      _.forEach(data.skillPoints, (value, i) =>
        setSkillValue(builderData.skills[i].id, value)
      );

      _.forEach(data.equipments, (value, key) => storeItem(key, value));
    }
  );

  return (
    <>
      <Header
        levelValue={levelValue}
        setLevelValue={setLevelValue}
        setLevel={setLevel}
        getSkillPoints={getSkillPoints}
      />
      <section id={'left'}>
        <div class={'equipments'}>
          <Entries of={builderData.equipments}>
            {(key, value) => (
              <div class={`${key}`}>
                <For each={value()}>
                  {(s, i) => <Equipment type={s.type} index={s.index ?? -1} />}
                </For>
              </div>
            )}
          </Entries>
        </div>
        <div class={'skills'}>
          <For each={builderData.skills}>
            {(s, i) => (
              <Skill icon={s.icon} title={s.title} color={s.color} id={s.id} />
            )}
          </For>
        </div>
      </section>
      <section id={'right'}></section>
    </>
  );
}
