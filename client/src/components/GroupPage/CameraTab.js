import React, { useState, forwardRef } from "react";
import Nav from "react-bootstrap/Nav";
import styles from "./GroupPage.module.css";
import BackgroundContent from "./BackgroundContent";
import SelfUploadBgContent from "./SelfUploadBgContent";
import EffectContent from "../Camera/EffectContent";

const CameraTabs = forwardRef((props, ref) => {
  let [tab, setTab] = useState(0);

  return (
    <div>
      <div className={styles.tab_container}>
        <Nav
          variant="tabs"
          defaultActiveKey="link0"
          className="chooses"
          style={{ paddingTop: "6px" }}
        >
          <Nav.Item>
            <Nav.Link
              onClick={() => {
                setTab(0);
              }}
              eventKey="link0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                class="bi bi-card-image"
                viewBox="0 0 16 16"
              >
                <path
                  d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
                  fill={tab === 0 ? "#fc8da1" : "#959595"}
                />
                <path
                  d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"
                  fill={tab === 0 ? "#fc8da1" : "#959595"}
                />
              </svg>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              onClick={() => {
                setTab(1);
              }}
              eventKey="link1"
            >
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                class="bi bi-cloud-upload-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0zm-.5 14.5V11h1v3.5a.5.5 0 0 1-1 0z"
                  fill={tab === 1 ? "#fc8da1" : "#959595"}
                />
              </svg> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                class="bi bi-upload"
                viewBox="0 0 16 16"
              >
                <path
                  d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
                  fill={tab === 1 ? "#fc8da1" : "#959595"}
                />
                <path
                  d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"
                  fill={tab === 1 ? "#fc8da1" : "#959595"}
                />
              </svg>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              onClick={() => {
                setTab(2);
              }}
              eventKey="link2"
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 17 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 0C10.3244 0 10.6456 0.0638885 10.9453 0.188018C11.2449 0.312147 11.5172 0.494086 11.7466 0.723446C11.9759 0.952807 12.1579 1.2251 12.282 1.52477C12.4061 1.82445 12.47 2.14563 12.47 2.47L12.469 3H16C16.2652 3 16.5196 3.10536 16.7071 3.29289C16.8947 3.48043 17 3.73478 17 4L16.999 7.499L15.469 7.5C14.8423 7.50016 14.239 7.73858 13.7815 8.16695C13.3239 8.59532 13.0464 9.1816 13.005 9.807L13 9.97V10.03C12.9999 10.6569 13.2382 11.2604 13.6666 11.7182C14.095 12.1759 14.6815 12.4536 15.307 12.495L15.47 12.5L16.999 12.499L17 16.003C17 16.2682 16.8947 16.5226 16.7071 16.7101C16.5196 16.8976 16.2652 17.003 16 17.003L12.469 17.002V17.53C12.4756 17.8585 12.4166 18.185 12.2955 18.4904C12.1744 18.7958 11.9935 19.0739 11.7636 19.3086C11.5336 19.5432 11.2591 19.7296 10.9562 19.8569C10.6533 19.9841 10.3281 20.0497 9.99952 20.0497C9.67098 20.0497 9.34573 19.9841 9.04283 19.8569C8.73993 19.7296 8.46546 19.5432 8.23549 19.3086C8.00552 19.0739 7.82467 18.7958 7.70354 18.4904C7.5824 18.185 7.52341 17.8585 7.53002 17.53V17.002H4.00002C3.73481 17.002 3.48045 16.8966 3.29292 16.7091C3.10538 16.5216 3.00002 16.2672 3.00002 16.002L2.99902 12.471H2.46902C1.81394 12.471 1.18568 12.2108 0.72247 11.7476C0.259255 11.2843 -0.000976562 10.6561 -0.000976562 10.001C-0.000976562 9.34592 0.259255 8.71766 0.72247 8.25445C1.18568 7.79123 1.81394 7.531 2.46902 7.531H3.00002V4C3.00002 3.73478 3.10538 3.48043 3.29292 3.29289C3.48045 3.10536 3.73481 3 4.00002 3H7.53002V2.47C7.53002 1.81492 7.79025 1.18666 8.25347 0.723446C8.71668 0.260232 9.34494 0 10 0Z"
                  fill={tab === 2 ? "#fc8da1" : "#959595"}
                />
              </svg>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
      <TabContent
        tab={tab}
        ImgBase64={props.ImgBase64}
        setImgBase64={props.setImgBase64}
      />
    </div>
  );
});

function TabContent(props) {
  return [
    <div className={styles.tab_contents_container}>
      <BackgroundContent
        ImgBase64={props.ImgBase64}
        setImgBase64={props.setImgBase64}
      />
    </div>,
    <div className={styles.tab_contents_container}>
      <SelfUploadBgContent />
    </div>,
    <div className={styles.tab_contents_container}>
      <BackgroundContent />
    </div>,
  ][props.tab];
}

export default CameraTabs;
