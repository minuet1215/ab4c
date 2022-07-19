const JS_KEY = "675ccc8e4225cd7337832e8cac8e6fa3";

function KakaoInviteButton() {
  if (window.Kakao) {
    console.log(window.Kakao.isInitialized());
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(JS_KEY);
    }
  }

  const shareKakaoLink = () => {
    window.Kakao.Share.createCustomButton({
      container: "#kakaotalk-invite-sharing-btn",
      templateId: 79822,
      templateArgs:{
        'CUT_CAMERA' : "https://techblog.woowahan.com/8339/",
      }
    });
  };

  const onShareKakaoClick = () => {
    shareKakaoLink(); 
  };
  return (
    <div>
      <a
        type="button"
        id="kakaotalk-invite-sharing-btn"
        href="javascript:;"
        onClick={onShareKakaoClick}
      >
        <img
          src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
          alt="카카오톡 초대링크"
        />
      </a>
    </div>
  );
}

export default KakaoInviteButton;