import './Builder.sass';
import Skill from "../components/builder/skill/Skill";
import { createSignal, For, createEffect } from "solid-js";
import * as data from '../data/builder/data.json';
import { decodeHash, processURI } from "../utils/decode-hash";
import { skillStore, updateTotal, setError, setMaxPoints } from "../store";

export default function Builder() {
    const getSkillPoints = (level) =>
        level < 1 ? 0 : level > data.maxLevelSkillPoint ? 200 : (level - 1) * 2;

    const setLevel = (value) => {
        setLevelValue(Math.min(Math.max(isNaN(parseInt(value)) ? 1 : parseInt(value), 1), data.maxLevel));
    };

    processURI();

    const { skill_points, level } = decodeHash(localStorage.getItem('v'), localStorage.getItem('hash'));
    const [levelValue, setLevelValue] = createSignal(level);

    createEffect(() => {
        const maxPoints = getSkillPoints(levelValue());
        setMaxPoints(maxPoints);
        skillStore.currentTotal = 0;
    });

    return (
        <>
            <header>
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
                        {skillStore.currentTotal === skillStore.maxPoints ? (
                            <small className={"success"}>({skillStore.currentTotal} assigned)</small>
                        ) : skillStore.currentTotal > skillStore.maxPoints ? (
                            <small className={"error"}>({skillStore.currentTotal} assigned)</small>
                        ) : (
                            <small className={"warning"}>({skillStore.currentTotal} assigned)</small>
                        )}
          </span>
                    <span>
            <button>Share</button>
            <button>Share 2</button>
          </span>
                    <span>
            <button className={"reset"}>Reset</button>
          </span>
                </h2>
            </header>

            <div className="equipements"></div>
            <div className="skills">
                <For each={data.skills}>{(s, i) =>
                    <Skill
                        icon={s.icon}
                        title={s.title}
                        color={s.color}
                        value={skill_points[i()]}
                        bonus={20}
                        mandatory={0}
                    />
                }</For>
            </div>
        </>
    );
}
