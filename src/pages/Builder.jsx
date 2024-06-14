import './Builder.sass'
import Skill from "../components/builder/skill/Skill";

export default function Builder() {
    return (<>
        <div class="level">
            <h1>Level 1</h1>
            <input type="number" value={1}/>
        </div>
        <div class="equipements">

        </div>
        <div class="skills">
            <Skill icon={"✤"} title={"Strength"} color={"#00AA00"} input={0} assign={0} original={0} modifier={0}/>
            <Skill icon={"✦"} title={"Dexterity"} color={"#FFFF55"} input={0} assign={0} original={0} modifier={0}/>
            <Skill icon={"❉"} title={"Intelligence"} color={"#55FFFF"} input={0} assign={0} original={0}
                   modifier={0}/>
            <Skill icon={"✹"} title={"Defense"} color={"#FF5555"} input={0} assign={0} original={0} modifier={0}/>
            <Skill icon={"❋"} title={"Agility"} color={"#FFFFFF"} input={0} assign={0} original={0} modifier={0}/>
        </div>
    </>);
}
