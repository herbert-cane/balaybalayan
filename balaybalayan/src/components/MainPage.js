import React from 'react';
import { useState } from "react";
import './script.js';
import banner from './photos/banner.png'; // Import the banner image
import './main.css'; // Import the CSS file
import './swiper-bundle.min.css';



function MainPage() {
  return (
    <><div>
      <img id="banner" src={banner} alt="Banner" /> {/* Added an ID to the banner */}
    </div><div class="ex-do">
      <h2> Explore Dormitories</h2></div><div class="container-fluid swiper">
      <div class="slideContainer">
        <div class="card-wrapper swiper-wrapper">
          <div class="card swiper-slide">
            <div class="image-box">
              <img src= {require(".//photos/dorm1.png")} alt="" class="card-img"></img>
            </div>
            <div class="dorm-type">
              <img src={require(".//photos/logo4.png")} alt=""></img>
              <div class="dorm-details">
                <h3 class="dorm-name">No Villa's</h3>
                <h5 class="dorm-description">Hatdog</h5>
              </div>
            </div>
            <button class="button">Check Dormitory</button>
          </div><div class="card swiper-slide">
            <div class="image-box">
              <img src= {require(".//photos/dorm2.png")} alt="" class="card-img"></img>
            </div>
            <div class="dorm-type">
              <img src={require(".//photos/logo4.png")} alt=""></img>
              <div class="dorm-details">
                <h3 class="dorm-name">No Villa's</h3>
                <h5 class="dorm-description">Hatdog</h5>
              </div>
            </div>
            <button class="button">Check Dormitory</button>
          </div><div class="card swiper-slide">
            <div class="image-box">
              <img src= {require(".//photos/dorm3.png")} alt="" class="card-img"></img>
            </div>
            <div class="dorm-type">
              <img src={require(".//photos/logo4.png")} alt=""></img>
              <div class="dorm-details">
                <h3 class="dorm-name">No Villa's</h3>
                <h5 class="dorm-description">Hatdog</h5>
              </div>
            </div>
            <button class="button">Check Dormitory</button>
          </div><div class="card swiper-slide">
            <div class="image-box">
              <img src= {require(".//photos/dorm1.png")} alt="" class="card-img"></img>
            </div>
            <div class="dorm-type">
              <img src={require(".//photos/logo4.png")} alt=""></img>
              <div class="dorm-details">
                <h3 class="dorm-name">No Villa's</h3>
                <h5 class="dorm-description">Hatdog</h5>
              </div>
            </div>
            <button class="button">Check Dormitory</button>
          </div><div class="card swiper-slide">
            <div class="image-box">
              <img src= {require(".//photos/dorm2.png")} alt="" class="card-img"></img>
            </div>
            <div class="dorm-type">
              <img src={require(".//photos/logo4.png")} alt=""></img>
              <div class="dorm-details">
                <h3 class="dorm-name">No Villa's</h3>
                <h5 class="dorm-description">Hatdog</h5>
              </div>
            </div>
            <button class="button">Check Dormitory</button>
          </div><div class="card swiper-slide">
            <div class="image-box">
              <img src= {require(".//photos/dorm1.png")} alt="" class="card-img"></img>
            </div>
            <div class="dorm-type">
              <img src={require(".//photos/logo4.png")} alt=""></img>
              <div class="dorm-details">
                <h3 class="dorm-name">No Villa's</h3>
                <h5 class="dorm-description">Hatdog</h5>
              </div>
            </div>
            <button class="button">Check Dormitory</button>
          </div>
        </div>
      </div>
      <div class="swiper-button-next swiper-navBtn"></div>
      <div class="swiper-button-prev swiper-navBtn"></div>
      <div class="swiper-pagination"></div>
    </div>
    <script src={require("https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js")}></script>
    <script src={require("./script.js")}></script><div className="amenities">
      <h2>Amenities</h2>
      <ul>
        <li>Free Wi-Fi</li>
        <li>24/7 Security</li>
        <li>Study Lounges</li>
        <li>Fitness Center</li>
        <li>Laundry Facilities</li>
        <li>Common Room</li>
      </ul>
    </div></>
  );
}

export default MainPage;
