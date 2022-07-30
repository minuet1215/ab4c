import React from "react";
import "../../App.css";
function PrintPage({ isPrintStart, setPrintEnd }) {
  return (
    <div className="outer_container">
      <div>
        <div className="slot">
          <div
            className={`photoHolder ${
              isPrintStart !== undefined ? "Print" : ""
            }`}
          >
            <div className="photo">
              <img alt="printingimage" id="printingimage" src={isPrintStart} />
            </div>
          </div>
        </div>
      </div>
      <button onClick={() => setPrintEnd(true)}>다음</button>
    </div>
  );
}
export default PrintPage;
