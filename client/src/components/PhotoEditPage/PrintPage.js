import React, { useEffect } from "react";
// import "../../App.css"; // import 하지 않아도 기본적으로 적용됨

function PrintPage({ isPrintStart, setPrintEnd }) {
  // 4초 후 화면 자동 전환
  useEffect(() => {
    const timer = setTimeout(() => setPrintEnd(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="outer_container"
      style={{ backgroundColor: "#FFF4F7" }}
      onClick={() => setPrintEnd(true)}
    >
      <div className="printer">
        <span>안방네컷 출력구</span>
      </div>
      <div className="slot">
        <div
          className={`photoHolder ${isPrintStart !== undefined ? "Print" : ""}`}
        >
          <div className="photo">
            <img alt="printingimage" id="printingimage" src={isPrintStart} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default PrintPage;
