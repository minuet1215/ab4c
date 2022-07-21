import styles from "./ImageSlides.module.css";
import React from "react";

let slides = document.querySelectorAll(".slides"),
  slide = document.querySelectorAll(".slides li"),
  currentIdx = 0,
  slideCount = slide.length,
  slideWidth = 200,
  slideMargin = 30,
  prevBtn = document.querySelector(".prev"),
  nextBtn = document.querySelector(".next");
function mainSlide() {
  makeClone();

  function makeClone() {
    for (let i = 0; i < slideCount; i++) {
      // a.cloneNode(), a.cloneNode(true);
      let cloneSlide = slide[i].cloneNode(true);
      cloneSlide.classList.add("clone");
      //a.appendChide(b)
      slides.appendChild(cloneSlide);
    }
    for (let i = 0; i < slideCount - 1; i--) {
      let cloneSlide = slide[i].cloneNode(true);
      cloneSlide.classList.add("clone");
      slides.prepend(cloneSlide);
    }
    updateWidth();
    setInitialPos();
    setTimeout(function () {
      slides.classList.add("animated");
    }, 100);
  }

  function updateWidth() {
    let currentSlides = document.querySelectorAll(".slides li");
    let newSlideCount = currentSlides.length;
    let newWidth =
      (slideWidth + slideMargin) * newSlideCount - slideMargin + "px";
    slides.style.width = newWidth;
  }
  function setInitialPos() {
    let initialTranslateValue = -(slideWidth + slideMargin) * slideCount;
    slides.style.transform = `translateX(` + initialTranslateValue + `px)`;
  }

  nextBtn.addEventListener("click", function () {
    moveSlide(currentIdx + 1);
  });
  prevBtn.addEventListener("click", function () {
    moveSlide(currentIdx - 1);
  });
  function moveSlide(num) {
    slides.style.left = -num * (slideWidth + slideMargin) + "px";
    currentIdx = num;
    if (currentIdx == slideCount || currentIdx == -slideCount) {
      setTimeout(function () {
        slides.classList.remove("animated");
        slides.style.left = "0px";
        currentIdx = 0;
      }, 500);
      setTimeout(function () {
        slides.classList.add("animated");
      }, 600);
    }
  }

  return (
    <div>
      <div class="slide_wrapper">
        <ul class="slides">
          <li>slide 01</li>
          <li>slide 02</li>
          <li>slide 03</li>
          <li>slide 04</li>
          <li>slide 05</li>
        </ul>
      </div>
      <p class="controls">
        <span class="prev">prev</span>
        <span class="next">next</span>
      </p>
    </div>
  );
}

export default mainSlide;
