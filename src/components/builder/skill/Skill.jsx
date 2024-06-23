import './Skill.sass';
import {createEffect, createSignal} from 'solid-js';
import {setError, setSkillStore, skillStore} from '../../../store';
import {builderData} from '../../../data';

export function Skill(props) {
  const {icon, title, color, id} = props;
  const [getValue, setValue] = createSignal(0);
  const [getSelf, setSelf] = createSignal(0);
  const [hasError, setHasError] = createSignal(false);

  // Dynamic signals for bonus and mandatory, initialized from skillStore
  const [getBonus, setBonus] = createSignal(skillStore.bonus[id]);
  const [getMandatory, setMandatory] = createSignal(skillStore.mandatory[id]);

  createEffect(() => {
    setBonus(skillStore.bonus[id]);
    setMandatory(skillStore.mandatory[id]);
  });

  createEffect(() => {
    const initialValue = skillStore.value[id] || getMandatory();

    setValue(initialValue);
    setSelf(initialValue - getBonus());
    setSkillStore('self', id, initialValue - getBonus()); // Set the initial self value
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
    const newValue = getValue() < getMandatory() ? getMandatory() : getValue();
    setSelf(newValue - getBonus());
    setSkillStore('self', id, newValue - getBonus()); // Update self value in skillStore
  });

  // Function to change the value based on user input
  const changeValue = (v) => {
    v = parseInt(v);
    v = isNaN(v) ? getMandatory() : v;

    if (v < getMandatory()) v = getMandatory();

    const newSelf = v - getBonus();
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
      <span class={'icon'}>{builderData.icons[icon]}</span>
      <h2>{title}</h2>
      <input
        type="number"
        value={getValue()}
        min={getMandatory()}
        onInput={(e) => changeValue(e.target.value)}
        onFocusOut={(e) => (e.target.value = getValue())}
      />
      <p>
        Assigned: {getSelf()} (+{getBonus()}) - {getMandatory()}
      </p>
    </div>
  );
}
