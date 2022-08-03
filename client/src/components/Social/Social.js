import React from "react";

import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LineShareButton,
  LineIcon,
} from "react-share";


const Social = (props) => {
  // const domain = "https://www.4cut.shop";
  const title = "[안방네컷] 사진이 공유되었어요!";
  const hashtag = "#안방네컷";
  const hashtags = ["안방네컷"];
  return (
    <>
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
    </>
  );
};

export default Social;
