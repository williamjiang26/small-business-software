import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Core Swiper styles
import "swiper/css/navigation"; // Optional navigation styles
import "swiper/css/pagination"; // Optional pagination styles

import Image from "next/image";

import { Navigation, Pagination } from "swiper/modules"; // Feature modules

const ImageCarousel = ({ images }) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      loop={true}
      spaceBetween={10}
      slidesPerView={1}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <Image
            src={image}
            alt={`Slide ${index}`}
            width={300}
            height={150}
            className="rounded h-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageCarousel;
