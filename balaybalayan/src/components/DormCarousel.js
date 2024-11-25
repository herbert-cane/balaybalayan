import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DormCarousel.css';
import dormitories from '../dormitories';  // Ensure the data is correctly imported
import { Swiper, SwiperSlide } from 'swiper/react';
import './swiper-bundle.min.css';

const DormCarousel = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid swiper">
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        loop={true}
        style={{paddingBottom: '3rem'}}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {dormitories.map((dorm, index) => (
          <SwiperSlide key={index}>
            <div className="card">
              <div className="image-box">
                <img 
                  src={dorm.dormPhoto || '/path/to/fallback-image.png'} 
                  alt={`${dorm.dormName} image`} 
                  className="card-img" 
                />
              </div>
              <div className="dorm-type">
                <img 
                  src={dorm.dormLogo || '/path/to/fallback-logo.png'} 
                  alt={`${dorm.dormName} logo`} 
                />
                <div className="dorm-details">
                  <h3 className="dorm-name">{dorm.dormName}</h3>
                  <h5 className="dorm-description">{dorm.description}</h5>
                </div>
              </div>
              <button className="carousel-button" onClick={() => navigate(dorm.path)}>
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
