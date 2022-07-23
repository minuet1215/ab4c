import LazyLoad from "react-lazyload";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { useRef } from "react";

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 50vw;
`;

const loadingAnimation = keyframes`
0% {
background-color: #fff;
}
50% {
background-color: #ccc;
}
100% {
background-color: #fff;
}
`;

const Placeholder = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  animation: ${loadingAnimation} 1s infinite;
`;

const StyledImage = styled.img`
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const LazyImage = ({ src, alt }) => {
  const refPlaceholder = useRef();

  const removePlaceholder = () => {
    refPlaceholder.current.remove();
  };
  return (
    <ImageWrapper>
      <Placeholder ref={refPlaceholder} />
      <LazyLoad>
        <StyledImage
          onLoad={removePlaceholder}
          onError={removePlaceholder}
          src={src}
          alt={alt}
        />
      </LazyLoad>
    </ImageWrapper>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default LazyImage;
