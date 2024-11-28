import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DormCarousel.css';
import { db, collection, getDocs } from '../firebase'; // Import Firestore functions
import { Swiper, SwiperSlide } from 'swiper/react';
import './swiper-bundle.min.css';

const DormCarousel = () => {
  const [dormitories, setDormitories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch dormitories data from Firestore
    const fetchDormitories = async () => {
      const querySnapshot = await getDocs(collection(db, 'dormitories'));
      const dormsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDormitories(dormsList);
    };

    fetchDormitories();
  }, []); // Run once when the component mounts

  return (
    <div className="container-fluid swiper">
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        loop={true}
        style={{ paddingBottom: '3rem' }}
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
        {dormitories.map((dorm) => (
          <SwiperSlide key={dorm.id}>
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
              <button
                className="carousel-button"
                onClick={() => navigate(dorm.path)}
              >
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
