import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { getPosition, getBannerActive } from "../../server/userstore";
import "./carousel.scss";

const CustomCarousel = () => {
  const [cardss, setCardss] = useState([]);
  const cards = [
    {
      image: {
        url: "https://res.cloudinary.com/dinvkxkt1/image/upload/v1735138931/Banner/jlredwcpq8rty1soh5gx.png",
        alternativeText: "First Slide"
      },
      bannerName: "First Slide",
      redirectUrl: "Place ad here."
    },
    {
      image: {
        url: "https://res.cloudinary.com/dinvkxkt1/image/upload/v1735138931/Banner/jlredwcpq8rty1soh5gx.png",
        alternativeText: "Second Slide"
      },
      bannerName: "Second Slide",
      redirectUrl: "Place ad here."
    },
    {
      image: {
        url: "https://res.cloudinary.com/dinvkxkt1/image/upload/v1735138931/Banner/jlredwcpq8rty1soh5gx.png",
        alternativeText: "Third Slide"
      },
      bannerName: "Third Slide",
      redirectUrl: "Place ad here."
    },
    {
      image: {
        url: "https://res.cloudinary.com/dinvkxkt1/image/upload/v1735138931/Banner/jlredwcpq8rty1soh5gx.png",
        alternativeText: "Fourth Slide"
      },
      bannerName: "Fourth Slide",
      redirectUrl: "Place ad here."
    },
    {
      image: {
        url: "https://res.cloudinary.com/dinvkxkt1/image/upload/v1735138931/Banner/jlredwcpq8rty1soh5gx.png",
        alternativeText: "Fifth Slide"
      },
      bannerName: "Fifth Slide",
      redirectUrl: "Place ad here."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = JSON.parse(localStorage.getItem("access_token")); // Replace with actual access token
        const positions = await getPosition(accessToken);
        const topBannerPosition = positions.listData.find(position => position.positionName === "Top-Banner");

        if (topBannerPosition) {
          const banners = await getBannerActive(accessToken, topBannerPosition.id);
          let fetchedCards = banners.listData;

          if (fetchedCards.length < 5) {
            fetchedCards = [...fetchedCards, ...cards.slice(0, 5 - fetchedCards.length)];
          }

          setCardss(fetchedCards);
        } else {
          setCardss(cards);
        }
      } catch (error) {
        console.error("Error while fetching banners:", error.message);
        setCardss(cards);
      }
    };

    fetchData();
  }, []);

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
        {cardss.map((card, index) => (
          <Box key={index} className="carousel-slide">
            <a href={card.redirectUrl}>
              <img
                src={card.image.url}
                alt={card.image.alternativeText}
                className="carousel-image"
              />
            </a>
            <Box className="carousel-caption">
              <Typography variant="h4" component="h3">
                {card.bannerName}
              </Typography>
              <Typography variant="body1">{card.redirectUrl}</Typography>
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