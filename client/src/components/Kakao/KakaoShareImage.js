import kakao_logo from "./kakao_logo.png";
const JS_KEY = "5cad0b12e82f5787a5059644f0b6370e";

function KakaoShareImageButton({ image_url, path }) {
  if (window.Kakao) {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(JS_KEY);
    }
  }

  const shareKakaoLink = () => {
    // const imgUrl =
    //   "https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"; // test

    window.Kakao.Share.sendCustom({
      templateId: 80020,
      templateArgs: {
        TITLE: "공유",
        DESC: "안방네컷 사진이 도착했습니다!",
        // THUMB: imgUrl, // 해당 이미지의 URL 지정 필요
        BUTTONTITLE: "사진 보러가기",
        PATH: path, // 이미지 주소 지정 필요 ('https://<도메인>/'의 밑에있는 주소)
      },
    });
  };

  const onShareKakaoClick = () => {
    shareKakaoLink();
  };
  return (
    <button
      className="sign_in_kakao"
      style={{
        width: "31px",
        height: "31px",
        borderRadius: "50%",
        border: "none",
      }}
      onClick={onShareKakaoClick}
    >
      <img src={kakao_logo} alt="kakao" />
    </button>
  );
}

export default KakaoShareImageButton;
