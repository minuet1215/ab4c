import ReactGA from "react-ga";

export const eventTrack = (category, action, label) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};
