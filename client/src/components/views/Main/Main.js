import { Link } from "react-router-dom";

function LandingPage2() {
  return (
    <div className="box">
      <div>
        <Link to="/lobby">
          <button className="btn btn_bg1"> 촬영하기 </button>
        </Link>
        <Link to="/album">
          <button className="btn btn_bg2"> 내 앨범</button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage2;
