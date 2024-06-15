import './Skill.sass';
import { createSignal, createEffect, onCleanup } from 'solid-js';
import { skillStore, updateTotal, setError } from "../../../store";

export default function Skill(props) {
    const { icon, title, color, value, bonus, mandatory } = props;
    const [getSelf, setSelf] = createSignal(value - bonus);
    const [getValue, setValue] = createSignal(value);
    const [hasError, setHasError] = createSignal(false);

    createEffect(() => {
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

    function changeValue(v) {
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
    }

    return (
        <div class={`skill ${hasError() ? 'error' : ''}`} style={{ color: color }}>
            <span className={"icon"}>{icon}</span>
            <h2>{title}</h2>
            <input
                type="number"
                value={getValue()}
                min={mandatory}
                onInput={(e) => changeValue(e.target.value)}
                onFocusOut={(e) => e.target.value = getValue()}
            />
            <p>Self: {getSelf()}</p>
            <p>Mandatory: {mandatory}</p>
            <p>Bonus: {bonus}</p>
        </div>
    );
}
