import './Skill.sass'
import {createSignal} from 'solid-js';

export default function Skill(props) {
    const {icon, title, color, input, assign, original, modifier} = props;
    const [currentValue, setCurrentValue] = createSignal(input);
    const [assignedValue, setAssignedValue] = createSignal(assign);

    return <div class={"card"} style={{color: color}}>
        <span class={"icon"}>{icon}</span>
        <h2>{title}</h2>
        <input type="number" value={currentValue()}
               onInput={(e) => setCurrentValue(Number(e.target.value))}/>
        <p>Original: {original}</p>
        <p>Current: {currentValue()}</p>
        <p>Assigned: {assignedValue()}</p>
        <p>Value: {modifier}</p>
    </div>;
}