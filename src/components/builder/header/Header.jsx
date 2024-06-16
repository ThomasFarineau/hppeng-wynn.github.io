import './Header.sass';
import {createEffect, createSignal} from "solid-js";
import {setMaxPoints, skillStore} from "../../../store";
import 'boxicons';

export function Header(props) {
    const {levelValue, setLevel, getSkillPoints} = props;
    createSignal(levelValue);

    createEffect(() => {
        const maxPoints = getSkillPoints(levelValue());
        setMaxPoints(maxPoints);
        skillStore.currentTotal = 0;
    });

    return <header>
        <h1>Classname</h1>
        <h2>
            <span>
                <label>
                    Level
                    <input
                        type="number"
                        value={levelValue()}
                        min={1}
                        maxLength={3}
                        step={1}
                        onInput={(e) => setLevel(e.target.value)}
                        onFocusOut={(e) => e.target.value = String(levelValue())}
                    />
                </label>
            </span>
            <span>
                Skill Points: {skillStore.maxPoints}
                {skillStore.currentTotal === skillStore.maxPoints ? <small
                    class="success">({skillStore.currentTotal} assigned)</small> : skillStore.currentTotal > skillStore.maxPoints ?
                    <small class="error">({skillStore.currentTotal} assigned)</small> :
                    <small class="warning">({skillStore.currentTotal} assigned)</small>}
            </span>
            <span>
                <button class="share">Share <box-icon type="solid" name='share'/></button>
                <button class="share">Share 2 <box-icon type="solid" name='share-alt'/></button>
            </span>
            <span>
                <button class="reset">Reset <box-icon type="solid" name="trash"/></button>
            </span>
        </h2>
    </header>;
}
