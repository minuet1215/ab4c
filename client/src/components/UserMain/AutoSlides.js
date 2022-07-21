import React, { Component } from "react";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import img1 from "../../img/1.jpg";
import img2 from "../../img/2.jpg";
import img3 from "../../img/3.jpg";
import img4 from "../../img/4.jpg";

const Container = styled.div`
  overflow: hidden;
`;

const StyledSlider = styled(Slider)`
  .slick-slide div {
    outline: none;
  }
`;

const ImageContainer = styled.div`
  margin: 0 8px;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

// const imgUrl = require("./image/temp.jpg");

const items = [
  { id: 1, url: img1 },
  { id: 2, url: img2 },
  { id: 3, url: img3 },
  { id: 4, url: img4 },
  { id: 5, url: img1 },
  { id: 6, url: img2 },
  { id: 7, url: img3 },
  { id: 8, url: img4 },
  // { id: 9, url: imgUrl },
  // { id: 10, url: imgUrl },
];

export default class AutoSlides extends Component {
  render() {
    const settings = {
      dots: false,
      infinite: true, //무한 반복 옵션
      speed: 2000, // 다음 버튼 누르고 다음 화면 뜨는데까지 걸리는 시간(ms)
      slidesToShow: 2, // 한 화면에 보여질 컨텐츠 개수
      slidesToScroll: 1, //스크롤 한번에 움직일 컨텐츠 개수
      //   arrows: false,
      autoplay: true, // 자동 스크롤 사용 여부
      autoplaySpeed: 2000, // 자동 스크롤 시 다음으로 넘어가는데 걸리는 시간 (ms)
      centerMode: true,
      //   cssEase: "linear",
    };
    return (
      <Container>
        <h2> BEST PHOTO </h2>
        <StyledSlider {...settings}>
          {items.map((item) => {
            return (
              <div key={item.id}>
                <ImageContainer>
                  <Image src={item.url} />
                </ImageContainer>
              </div>
            );
          })}
        </StyledSlider>
      </Container>
    );
  }
}
