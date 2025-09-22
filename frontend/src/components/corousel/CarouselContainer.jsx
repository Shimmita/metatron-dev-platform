import React from 'react';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './Carousel.css'

import Python from '../../images/python.jpeg'
import ReactNative from '../../images/reactnative.jpeg'
import PostgreSQL from '../../images/postgres.png'

const images = [
  Python,ReactNative,PostgreSQL
];

function CarouselContainer() {
  
  return (
    <div className="box" style={{
      width:350,
      height:300
    }}>
    <Carousel>
      {images.map((URL, index) => (
        <div className="slide" key={index}>
          <img alt="" src={URL} key={index} />
        </div>
      ))}
    </Carousel>
  </div>
  );
}
export default CarouselContainer;
