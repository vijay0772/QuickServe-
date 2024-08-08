import React from "react";
import Slider from "react-slick";


import "../../../styles/slider.css";

const TestimonialSlider = () => {
  const settings = {
    dots: true,
    autoplay: true,
    infinite: true,
    speed: 1000,
    autoplaySpeed: 3000,
    swipeToSlide: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider {...settings}>
      <div>
        <p className="review__text">
        
        </p>
        <div className=" slider__content d-flex align-items-center gap-3 ">
          <h6>Vijay</h6>
        </div>
      </div>
      <div>
        <p className="review__text">
         
        </p>
        <div className="slider__content d-flex align-items-center gap-3 ">
          <h6>het</h6>
        </div>
      </div>
      <div>
        <p className="review__text">
        
        </p>
        <div className="slider__content d-flex align-items-center gap-3 ">
          <h6>Krishna</h6>
        </div>
      </div>
    </Slider>
  );
};

export default TestimonialSlider;
