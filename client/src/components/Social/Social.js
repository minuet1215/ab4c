import React from "react";
// import Helmet from "react-helmet";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LineShareButton,
  LineIcon,
} from "react-share";
// import KakaoShareImageButton from "../Kakao/KakaoShareImage";

const Social = (props) => {
  // const img = "https://www.4cut.shop/cute.gif";
  const domain = "https://www.4cut.shop";
  const currentUrl = domain + window.location.pathname; // 해당 페이지의 url
  const title = "[안방네컷] 사진이 공유되었어요!";
  const hashtag = "#안방네컷";
  const hashtags = ["안방네컷"];
  return (
    <>
      {/* <Helmet>
        <title>안방네컷 소셜 공유</title>
        <meta name="description" content="안방네컷 소셜 공유" />
        <meta property="og:title" content={title} />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="720" />
        <meta property="og:image" content={img} />
        <meta property="og:url" content={currentUrl} />
      </Helmet> */}
      <FacebookShareButton
        url={props.img}
        quote={title}
        hashtag={hashtag}
        style={{ margin: "5px" }}
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton
        url={props.img}
        title={title}
        hashtags={hashtags}
        style={{ margin: "5px" }}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <LineShareButton url={props.img} title={title} style={{ margin: "5px" }}>
        <LineIcon size={32} round />
      </LineShareButton>
      {/* <KakaoShareImageButton path={window.location.pathname} /> */}
    </>
  );
};

export default Social;
