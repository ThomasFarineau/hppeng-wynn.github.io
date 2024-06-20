import './Header.sass';
import {createEffect, createSignal} from 'solid-js';
import {
  equipmentStore,
  setCurrentTotal,
  setMaxPoints,
  skillStore
} from '../../../store';
import 'boxicons';
import {builderData} from '../../../data';

export function Header(props) {
  let [className, setClassName] = createSignal('No weapon selected');

  const {levelValue, setLevel, getSkillPoints} = props;
  createSignal(levelValue);

  createEffect(() => {
    let weapon = equipmentStore.items.weapon;
    if (weapon) {
      let selectedClass = builderData.classes[weapon.type];
      setClassName(`${selectedClass.default} (${selectedClass.reskinned})`);
    } else {
      setClassName('No weapon selected');
    }
  });

  createEffect(() => {
    const maxPoints = getSkillPoints(levelValue());
    setMaxPoints(maxPoints);
  });

  return (
    <header>
      <div class={'classname'}>{className()}</div>
      <div class={'level'}>
        <label>
          Level
          <input
            type="number"
            value={levelValue()}
            min={1}
            maxLength={3}
            step={1}
            onInput={(e) => setLevel(e.target.value)}
            onFocusOut={(e) => (e.target.value = String(levelValue()))}
          />
        </label>
      </div>
      <div class={'skillPoints'}>
        Skill Points: {skillStore.maxPoints}
        {skillStore.currentTotal === skillStore.maxPoints ? (
          <small class="success">({skillStore.currentTotal} assigned)</small>
        ) : skillStore.currentTotal > skillStore.maxPoints ? (
          <small class="error">({skillStore.currentTotal} assigned)</small>
        ) : (
          <small class="warning">({skillStore.currentTotal} assigned)</small>
        )}
      </div>
      <div class={'buttons'}>
        <button class={'share'}>
          Share <box-icon type="solid" name="share" />
        </button>
        <button class={'share'}>
          Share 2 <box-icon type="solid" name="share-alt" />
        </button>
        <button class={'reset'}>
          Reset <box-icon type="solid" name="trash" />
        </button>
      </div>
    </header>
  );
}
