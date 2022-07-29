import React from "react";
import ChangingProgressProvider from "./ChangingProgressProvider";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
// import styles from "../GroupPage/GroupPage.module.css";

const CountDown = () => (
  // }
  <div style={{ width: "50%" }}>
    <ChangingProgressProvider values={[100, 80, 60, 40, 20, 0]}>
      {(countDown) => (
        <CircularProgressbar
          value={countDown}
          text={Math.floor(countDown / 20)}
          strokeWidth={8} // 두께(기본)
          styles={buildStyles({
            pathTransitionDuration: 3, // 애니메이션이 따라오는 속도
            textSize: "14px",
            pathColor: "rgb(15, 140, 249)",
            trailColor: "rgba(148, 187, 233, 1)",
          })}
        />
      )}
    </ChangingProgressProvider>
  </div>
);

export default CountDown;
