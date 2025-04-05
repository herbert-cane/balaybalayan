import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DormCarousel.css';
import { db, collection, getDocs } from '../firebase'; // Import Firestore functions
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

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
    <div className="carousel-container">
      <Carousel
        showArrows={true}
        showStatus={false}
        showThumbs={false}
        infiniteLoop={true}
        centerMode={true}
        centerSlidePercentage={25}
        swipeable={false}
        emulateTouch={false}
        useKeyboardArrows={true}
        autoPlay={false}
        stopOnHover={true}
        interval={3000}
        transitionTime={300}
        showIndicators={false}
        selectedItem={0}
        swipeScrollTolerance={50}
        preventMovementUntilSwipeScrollTolerance={true}
        width="100%"
        dynamicHeight={false}
        renderArrowPrev={(onClickHandler, hasPrev) => (
          <button 
            type="button" 
            onClick={onClickHandler} 
            className="carousel-arrow prev"
          >
            &#8249;
          </button>
        )}
        renderArrowNext={(onClickHandler, hasNext) => (
          <button 
            type="button" 
            onClick={onClickHandler} 
            className="carousel-arrow next"
          >
            &#8250;
          </button>
        )}
      >
        {dormitories.map((dorm) => (
          <div key={dorm.id} className="card">
            <div className="image-box">
              <img
                src={dorm.dormPhoto || 'https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/dorm_carousel_pic%2FplaceholderPic.png?alt=media&token=14f3543c-127e-46e9-9729-fd03379a70ab'}
                alt={`${dorm.dormName}`}
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
        ))}
      </Carousel>
    </div>
  );
};

export default DormCarousel;
