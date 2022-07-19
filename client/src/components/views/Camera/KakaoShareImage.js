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
      templateArgs:{
        'CUT_IMG' : "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c5a5238e-e140-4683-822d-372d65fded67/ladybug-7284337__480.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220718%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220718T152915Z&X-Amz-Expires=86400&X-Amz-Signature=105892f575bcbb5f05338a7cb28e8610303ce544637d6eefadc5511f61494240&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22ladybug-7284337__480.webp%22&x-id=GetObject",
        'CUT_IMG_DOWN' : "https://techblog.woowahan.com/8339/",
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