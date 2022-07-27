import React from "react";
import { render } from "react-dom";

import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import ChangingProgressProvider from "./ChangingProgressProvider";

const CountDown = () => (
  <Example label="Custom animation speed">
    <ChangingProgressProvider values={[5, 4, 3, 2, 1]}>
      {(countDown) => (
        <CircularProgressbar
          value={countDown}
          text={countDown}
          // text={`${percentage}%`}
          strokeWidth={5} // 두께
          styles={buildStyles({
            pathTransitionDuration: 0.15,
            textSize: "14px",
            pathColor: "turquoise",
            //   trailColor: "gold",
            // strokeLinecap: "butt", // 끝부분 각지게
          })}
        />
      )}
    </ChangingProgressProvider>
  </Example>
);

function Example(props) {
  return (
    <div style={{ marginBottom: 80 }}>
      <hr style={{ border: "2px solid #ddd" }} />
      <div style={{ marginTop: 30, display: "flex" }}>
        <div style={{ width: "30%", paddingRight: 30 }}>{props.children}</div>
        <div style={{ width: "70%" }}>
          <h3 className="h5">{props.label}</h3>
          <p>{props.description}</p>
        </div>
      </div>
    </div>
  );
}

render(<App />, document.getElementById("root"));

////////////////////

import React from "react";

class ChangingProgressProvider extends React.Component {
  static defaultProps = {
    interval: 1000,
  };

  state = {
    valuesIndex: 0,
  };

  componentDidMount() {
    setInterval(() => {
      this.setState({
        valuesIndex: (this.state.valuesIndex + 1) % this.props.values.length,
      });
    }, this.props.interval);
  }

  render() {
    return this.props.children(this.props.values[this.state.valuesIndex]);
  }
}

export default ChangingProgressProvider;
