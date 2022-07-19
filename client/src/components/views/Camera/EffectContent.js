import { Card } from "antd";
import React from "react";
// import tmp from "../../img/choose_effect.png";

const EffectContent = () => (
  <div className="scroll_content">
    <Card className="contents">
      <Card.Grid className="contentStyle">
        {/* <img src={tmp} className="cnt" /> */}
      </Card.Grid>
      <Card.Grid hoverable={true} className="contentStyle">
        {/* <img src={tmp} className="cnt" /> */}
      </Card.Grid>
      <Card.Grid className="contentStyle">
        <div className="cnt">eeee </div>
      </Card.Grid>
    </Card>
    <Card className="contents">
      <Card.Grid className="contentStyle">FFFFFF</Card.Grid>
      <Card.Grid className="contentStyle">Content</Card.Grid>
      <Card.Grid className="contentStyle">Content</Card.Grid>
    </Card>
    <Card className="contents">
      <Card.Grid className="contentStyle">Content</Card.Grid>
      <Card.Grid className="contentStyle">Content</Card.Grid>
      <Card.Grid className="contentStyle">Content</Card.Grid>
    </Card>
  </div>
);

export default EffectContent;
