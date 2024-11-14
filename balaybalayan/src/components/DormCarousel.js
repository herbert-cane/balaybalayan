import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DormCarousel.css';
import dormData from './DormData';

import { Swiper, SwiperSlide } from 'swiper/react';
import './swiper-bundle.min.css';

const DormCarousel = () => {
    const navigate = useNavigate();
  
    return (
      <div className="container-fluid swiper">
        <Swiper
          spaceBetween={20} // Space between each slide
          slidesPerView={1}  // Default to 1 slide per view for small screens
          navigation        // Enables navigation buttons
          pagination={{ clickable: true }}  // Enables pagination
          loop={true}       // Loops back to the first card after the last
          breakpoints={{
            640: {
              slidesPerView: 2,  // 2 slides on small devices (≥640px)
            },
            768: {
              slidesPerView: 3,  // 3 slides on medium devices (≥768px)
            },
            1024: {
              slidesPerView: 4,  // 4 slides on large devices (≥1024px)
            },
          }}
        >
          {dormData.map((dorm, index) => (
            <SwiperSlide key={index}>
              <div className="card">
                <div className="image-box">
                  <img src={dorm.image} alt={`${dorm.name} image`} className="card-img" />
                </div>
                <div className="dorm-type">
                  <img src={dorm.logo} alt={`${dorm.name} logo`} />
                  <div className="dorm-details">
                    <h3 className="dorm-name">{dorm.name}</h3>
                    <h5 className="dorm-description">{dorm.description}</h5>
                  </div>
                </div>
                <button className="button" onClick={() => navigate(dorm.path)}>
                  Check Dormitory
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };
export default DormCarousel;