const JS_KEY = "675ccc8e4225cd7337832e8cac8e6fa3";

function KakaoShareImageButton() {
  if (window.Kakao) {
    // console.log(window.Kakao.isInitialized());
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(JS_KEY);
    }
  }

  const shareKakaoLink = () => {
    window.Kakao.Share.createCustomButton({
      container: "#kakaotalk-image-sharing-btn",
      templateId: 79870,
      templateArgs: {
        CUT_IMG: "",
        CUT_IMG_DOWN: "",
      },
    });
  };

  const onShareKakaoClick = () => {
    shareKakaoLink();
  };
  return (
    <div>
      <a
        type="button"
        id="kakaotalk-image-sharing-btn"
        href="javascript:;"
        onClick={onShareKakaoClick}
      >
        <img
          src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
          alt="카카오톡 사진 공유"
        />
      </a>
    </div>
  );
}

export default KakaoShareImageButton;
