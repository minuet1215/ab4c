import React, { useState, useRef, useEffect } from "react";
import "../../App.css";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
function PrintPage({ isPrinting, setPrintEnd }) {
  return (
    <div className="outer_container">
      <div>
        <div className="slot">
          <div
            className={`photoHolder ${isPrinting != undefined ? "Print" : ""}`}
          >
            <div className="photo">
              <img id="printingimage" src={isPrinting} />
            </div>
          </div>
        </div>
      </div>
      <button onClick={() => setPrintEnd(true)}>다음</button>
    </div>
  );
}
export default PrintPage;
