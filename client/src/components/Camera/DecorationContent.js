import { Card } from "antd";
import React from "react";

const DecorationContent = () => (
  <div className="scroll_content">
    <Card className="contents">
      <Card.Grid className="contentStyle">ddddsf</Card.Grid>
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
  </div>
);

export default DecorationContent;
