import './Skill.sass';
import {createEffect, createSignal, onCleanup} from 'solid-js';
import {bonusAndMandatorySignal, setError, skillStore, updateTotal} from "../../../store";

export function Skill(props) {
    const {icon, title, color, value} = props;
    const [getSelf, setSelf] = createSignal(value - bonusAndMandatorySignal().bonus[props.id]);
    const [getValue, setValue] = createSignal(value);
    const [hasError, setHasError] = createSignal(false);

    createEffect(() => {
        const bonus = bonusAndMandatorySignal().bonus[props.id];
        const initialSelf = value - bonus;
        setSelf(initialSelf);
        updateTotal(initialSelf);

        onCleanup(() => updateTotal(-initialSelf));
    });

    createEffect(() => {
        const potentialTotal = skillStore.currentTotal;
        const errorCondition = potentialTotal > skillStore.maxPoints;
        setHasError(errorCondition);
        setError(errorCondition ? `Total skill points cannot exceed ${skillStore.maxPoints}.` : null);
    });

    createEffect(() => {
        const bonus = bonusAndMandatorySignal().bonus[props.id];
        setSelf(value - bonus);
    });

    const changeValue = v => {
        const bonus = bonusAndMandatorySignal().bonus[props.id]
        const mandatory = bonusAndMandatorySignal().mandatory[props.id];
        v = parseInt(v);
        v = isNaN(v) ? bonus + mandatory : v;

        if (v < (mandatory + bonus)) v = mandatory + bonus;

        const newSelf = v - bonus;
        const potentialTotal = skillStore.currentTotal - getSelf() + newSelf;
        if (potentialTotal <= skillStore.maxPoints) {
            setError(null);
            updateTotal(newSelf - getSelf());
            setSelf(newSelf);
            setValue(v);
        } else {
            updateTotal(newSelf - getSelf());
            setSelf(newSelf);
            setValue(v);
            setError(`Total skill points cannot exceed ${skillStore.maxPoints}.`);
        }
    };

    return <div class={`skill ${hasError() ? 'error' : ''}`} style={{color: color}}>
        <span class={"icon"}>{icon}</span>
        <h2>{title}</h2>
        <input
            type="number"
            value={getValue()}
            min={bonusAndMandatorySignal().mandatory[props.id] + bonusAndMandatorySignal().bonus[props.id]}
            onInput={(e) => changeValue(e.target.value)}
            onFocusOut={(e) => e.target.value = getValue()}
        />
        <p>Assigned: {getSelf()} (+{bonusAndMandatorySignal().bonus[props.id]}) - {bonusAndMandatorySignal().mandatory[props.id]}</p>
    </div>;
}
