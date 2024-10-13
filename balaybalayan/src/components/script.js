import Swiper from 'swiper/bundle';
import React, { useEffect } from "react";

var slideContainer = new Swiper('.slideContainer', {
    slidesPerView: 4,
    spaceBetween: 40,
    slidesPerGroup: 4,
    loop: true,
    centerslide: "true",
    grabCursor: "true",
    fade: "true",
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        520: {
            slidesPerView:2,
        },
        768: {
            slidesPerView:3,
        },
        1000: {
            slidesPerView:4,
        },
    },

  });
