import kakao_logo from "./kakao_logo.png";
const JS_KEY = "5cad0b12e82f5787a5059644f0b6370e";

function KakaoInviteButton({ path = "" }) {
  if (window.Kakao) {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(JS_KEY);
    }
  }
  const imgUrl =
    "https://www.4cut.shop/static/media/dog.bb3e182b978c1d3dc541.png"; // test

  const shareKakaoLink = () => {
    window.Kakao.Share.sendCustom({
      templateId: 80020,
      templateArgs: {
        TITLE: "초대",
        DESC: "안방네컷으로 같이 사진 찍어요!",
        THUMB: imgUrl, // 안방네컷 로고 생기면 그 사진 주소 지정 필요
        BUTTONTITLE: "사진 찍으러가기",
        PATH: path, // 그룹페이지 주소 지정 필요 ('https://<도메인>/'의 밑에있는 주소)
      },
    });
  };

  const onShareKakaoClick = () => {
    shareKakaoLink();
  };
  return (
    <button
      // className="button button_gap sign_in_kakao"
      className="button sign_in_kakao"
      onClick={onShareKakaoClick}
      style={{
        width: "100%",
        height: "100%",
        padding: "3%",
        margin: "5% 3% 5% 3%",
        fontSize: "16px",
      }}
    >
      <img
        src={kakao_logo}
        style={{ display: "inline-block", height: "25px" }}
        alt="kakao"
      />
      카카오로 초대하기
    </button>
  );
}

export default KakaoInviteButton;
