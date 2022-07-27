import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "./AnimatedProgressProvider";

const CountDown = () => (
  // }
  <div style={{ width: "60%" }}>
    {/* <ChangingProgressProvider values={[100, 71, 51, 21, 1, 0, 0, 0, 0]}> */}
    <AnimatedProgressProvider
      valueStart={100}
      valueEnd={0}
      duration={1.8}
      easingFunction={easeQuadInOut}
    >
      {(value) => {
        const roundedValue = Math.ceil(value / 20);
        return (
          <CircularProgressbar
            value={value}
            text={roundedValue}
            styles={buildStyles({ pathTransition: "none" })}
          />
        );
      }}
    </AnimatedProgressProvider>
    {/* </ChangingProgressProvider> */}
  </div>
);

export default CountDown;

// {(countDown) => (
//   <CircularProgressbar
//     value={countDown}
//     text={Math.ceil(countDown / 20)}
//     // text={`${percentage}%`}
//     strokeWidth={8} // 두께(기본)
//     styles={buildStyles({
//       // pathTransition:
//       //   countDown === 0 ? "none" : "stroke-dashoffset 0.25s ease 0",
//       pathTransitionDuration: 1.2, // 애니메이션이 따라오는 속도
//       textSize: "14px",
//       pathColor: "rgb(15, 140, 249)",
//       trailColor: "rgba(148, 187, 233, 1)",
//       // strokeLinecap: "butt", // 끝부분 각지게
//     }))}
