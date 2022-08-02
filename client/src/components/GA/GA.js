import ReactGA from "react-ga";

export const eventTrack = (category, action, label) => {
    console.log("GA event :", category, ":", action, ":", label);
    ReactGA.event({
        category : category,
        action : action,
        label : label
    })
    console.log('success');
}