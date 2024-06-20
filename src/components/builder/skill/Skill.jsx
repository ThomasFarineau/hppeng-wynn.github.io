import './Skill.sass';
import {createEffect, createSignal} from 'solid-js';
import {
  equipmentStore,
  setError,
  setSkillStore,
  skillStore
} from '../../../store';

export function Skill(props) {
  const {icon, title, color, id} = props;
  const [getValue, setValue] = createSignal(0);
  const [getSelf, setSelf] = createSignal(0);
  const [hasError, setHasError] = createSignal(false);

  createEffect(() => {
    const bonus = equipmentStore.bonusSkillpoints[id];
    const mandatory = equipmentStore.mandatorySkillpoints[id];
    const initialValue = skillStore.value[id] || mandatory;

    setValue(initialValue);
    setSelf(initialValue - bonus);
    setSkillStore('self', id, initialValue - bonus); // Set the initial self value
  });

  createEffect(() => {
    const potentialTotal = skillStore.currentTotal;
    const errorCondition = potentialTotal > skillStore.maxPoints;
    setHasError(errorCondition);
    setError(
      errorCondition
        ? `Total skill points cannot exceed ${skillStore.maxPoints}.`
        : null
    );
  });

  createEffect(() => {
    const bonus = equipmentStore.bonusSkillpoints[id];
    const mandatory = equipmentStore.mandatorySkillpoints[id];
    const newValue = getValue() < mandatory ? mandatory : getValue();
    setSelf(newValue - bonus);
    setSkillStore('self', id, newValue - bonus); // Update self value in skillStore
  });

  const changeValue = (v) => {
    const bonus = equipmentStore.bonusSkillpoints[id];
    const mandatory = equipmentStore.mandatorySkillpoints[id];
    v = parseInt(v);
    v = isNaN(v) ? mandatory : v;

    if (v < mandatory) v = mandatory;

    const newSelf = v - bonus;
    const potentialTotal = skillStore.currentTotal - getSelf() + newSelf;
    if (potentialTotal <= skillStore.maxPoints) {
      setError(null);
      setSelf(newSelf);
      setValue(v);
      setSkillStore('value', id, v);
      setSkillStore('self', id, newSelf); // Update self value in skillStore
    } else {
      setError(`Total skill points cannot exceed ${skillStore.maxPoints}.`);
    }
  };

  return (
    <div class={`skill ${hasError() ? 'error' : ''}`} style={{color: color}}>
      <span class={'icon'}>{icon}</span>
      <h2>{title}</h2>
      <input
        type="number"
        value={getValue()}
        min={equipmentStore.mandatorySkillpoints[id]}
        onInput={(e) => changeValue(e.target.value)}
        onFocusOut={(e) => (e.target.value = getValue())}
      />
      <p>
        Assigned: {getSelf()} (+{equipmentStore.bonusSkillpoints[id]}) -
        {equipmentStore.mandatorySkillpoints[id]}
      </p>
    </div>
  );
}
