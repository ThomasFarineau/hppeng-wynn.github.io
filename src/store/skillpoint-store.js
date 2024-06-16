import {createStore} from "solid-js/store";

const [skillStore, setSkillStore] = createStore({
    currentTotal: 0, maxPoints: 0, error: null
});


export function updateTotal(change) {
    setSkillStore("currentTotal", (prev) => prev + change);
}

export function setError(error) {
    setSkillStore("error", error);
}

export function setMaxPoints(points) {
    setSkillStore("maxPoints", points);
}

export {skillStore};

