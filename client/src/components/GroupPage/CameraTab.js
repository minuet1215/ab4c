import React, { forwardRef } from "react";
import styles from "./GroupPage.module.css";
import BackgroundContent from "./BackgroundContent";
import WithStar from "./WithStar";
import { Tabs } from "antd";
import { PictureFilled, ThunderboltFilled } from "@ant-design/icons";

const { TabPane } = Tabs;

const CameraTabs = forwardRef((props, ref) => {
  return (
    <>
      {props.roomname === props.token ? (
        <div className={styles.tab_container}>
          <Tabs
            className="custom-tab"
            defaultActiveKey="1"
            centered
            // size="large"
          >
            <TabPane
              tab={<PictureFilled style={{ fontSize: "20px" }} />}
              key="1"
            >
              <BackgroundContent
                ImgBase64={props.ImgBase64}
                setImgBase64={props.setImgBase64}
                ref={ref}
              />
            </TabPane>
            <TabPane
              tab={<ThunderboltFilled style={{ fontSize: "20px" }} />}
              key="2"
            >
              <WithStar ref={ref} />
            </TabPane>
          </Tabs>
        </div>
      ) : (
        <div className={styles.tab_contents_container}>
          <WithStar ref={ref} />
        </div>
      )}
    </>
  );
});

export default CameraTabs;
