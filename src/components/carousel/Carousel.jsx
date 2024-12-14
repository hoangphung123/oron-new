import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./carousel.scss";

const CustomCarousel = () => {
  const cards = [
    {
      image:
        "https://i.pinimg.com/564x/1e/db/c2/1edbc2367a605156d052c8fb415063a8.jpg",
      title: "First Slide",
      text: "Description for the first slide."
    },
    {
      image:
        "https://i.pinimg.com/564x/d3/ee/06/d3ee06c64b5f931bb9bd068792b57f39.jpg",
      title: "Second Slide",
      text: "Description for the second slide."
    },
    {
      image:
        "https://i.pinimg.com/564x/36/d8/99/36d899f2e42dda38b99eb1e5eb7e1ccf.jpg",
      title: "Third Slide",
      text: "Description for the third slide."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  };

  return (
    <Box className="carousel-container">
      {/* Navigation Buttons */}
      <IconButton
        className="carousel-button left"
        onClick={prevSlide}
        aria-label="Previous Slide"
      >
        <ArrowBackIosIcon />
      </IconButton>

      {/* Carousel Content */}
      <Box
        className="carousel-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {cards.map((card, index) => (
          <Box key={index} className="carousel-slide">
            <img
              src={card.image}
              alt={card.title}
              className="carousel-image"
            />
            <Box className="carousel-caption">
              <Typography variant="h4" component="h3">
                {card.title}
              </Typography>
              <Typography variant="body1">{card.text}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Next Button */}
      <IconButton
        className="carousel-button right"
        onClick={nextSlide}
        aria-label="Next Slide"
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

export default CustomCarousel;
