import './Builder.sass'
import Skill from "../components/builder/skill/Skill";

export default function Builder() {
    return (<>
        <h1>Builder Page</h1>
        <p>This is the Builder page.</p>


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
