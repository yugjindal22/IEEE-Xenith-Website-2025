import React, { useRef } from 'react';
import './Gallery.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';

import B01 from '../assets/gallery/img1.jpeg';
import B02 from '../assets/gallery/img2.jpg';
import B03 from '../assets/gallery/img3.jpg';
import B04 from '../assets/gallery/img4.jpg';
import B05 from '../assets/gallery/img5.jpeg';
import B06 from '../assets/gallery/img6.jpg';
import B07 from '../assets/gallery/img7.jpeg';
import B08 from '../assets/gallery/img8.jpeg';
import B09 from '../assets/gallery/img9.jpeg';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

const Gallery = () => {
  
  const swiperRef = useRef(null);

  return (
    <div className="gallery-container">
      <div className='bgtop'></div>
      <h1 className="heading">
        <center>GALLERY</center>
      </h1>
      <div className="slider-container">
      
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          slidesPerView={3}
          coverflowEffect={{
            rotate: 0,
            stretch: -75,
            depth: 250,
            modifier: 3.5,
            slideShadows: false,
          }}
          modules={[EffectCoverflow, Autoplay]}
          breakpoints={{
            0: {
              slidesPerView: 1,
              coverflowEffect: {
                stretch: -50,
              },
            },
            640: {
              slidesPerView: 3,
              coverflowEffect: {
                stretch: -75,
              },
            },
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {[B01, B02, B03, B04, B05, B06, B07, B08, B09].map((img, index) => (
            <SwiperSlide key={index}>
              <div
                className="slider-box"
                onMouseEnter={() => swiperRef.current?.autoplay.stop()}
                onMouseLeave={() => swiperRef.current?.autoplay.start()}
              >
                <img src={img} alt={`Slide ${index + 1}`} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    
    </div>
  );
};

export default Gallery;
