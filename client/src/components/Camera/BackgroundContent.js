import { Card } from "antd";
import React from "react";

// const contentStyle = {
//   //   textAlign: "center",
//   //   position: "flex",
//   //   width: "100%",
//   //   margin: "5% 0 0 0",
// };
// const gridStyle = {
//   //   textAlign: "center",
//   //   width: "28%",
//   //   hight: "30%",
//   //   margin: "5% 0 0 0",
// };

const BackgroundContent = () => (
  <div className="scroll_content">
    <Card className="contents">
      <Card.Grid className="contentStyle">bbbb</Card.Grid>
      <Card.Grid hoverable={true} className="contentStyle">
        Content
      </Card.Grid>
      <Card.Grid className="contentStyle">Content</Card.Grid>
    </Card>
    <Card className="contents">
      <Card.Grid className="contentStyle">Content</Card.Grid>
      <Card.Grid className="contentStyle">Content</Card.Grid>
      <Card.Grid className="contentStyle">Content</Card.Grid>
    </Card>
    <Card className="contents">
      <Card.Grid className="contentStyle">Content</Card.Grid>
      <Card.Grid className="contentStyle">Content</Card.Grid>
      <Card.Grid className="contentStyle">Content</Card.Grid>
    </Card>
    <Card className="contents">
      <Card.Grid className="contentStyle">Content</Card.Grid>
      <Card.Grid className="contentStyle">Content</Card.Grid>
      <Card.Grid className="contentStyle">Content</Card.Grid>
    </Card>
    <Card className="contents">
      <Card.Grid className="contentStyle">Content</Card.Grid>
      <Card.Grid className="contentStyle">Content</Card.Grid>
      <Card.Grid className="contentStyle">Content</Card.Grid>
    </Card>
    <Card className="contents">
      <Card.Grid className="contentStyle">Content</Card.Grid>
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

export default BackgroundContent;
