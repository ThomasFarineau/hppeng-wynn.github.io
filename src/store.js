import { createStore } from "solid-js/store";

const [skillStore, setSkillStore] = createStore({
    currentTotal: 0,
    maxPoints: 0,
    error: null
});

function updateTotal(change) {
    setSkillStore("currentTotal", (prev) => prev + change);
}

function setError(error) {
    setSkillStore("error", error);
}

function setMaxPoints(points) {
    setSkillStore("maxPoints", points);
}

export { skillStore, updateTotal, setError, setMaxPoints };
