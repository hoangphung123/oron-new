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
        url: "https://res.cloudinary.com/dinvkxkt1/image/upload/v1734717635/tfjhlf10gm3kfp4y8stj.png",
        alternativeText: "First Slide"
      },
      bannerName: "First Slide",
      redirectUrl: "Place ad here."
    },
    {
      image: {
        url: "https://i.pinimg.com/564x/d3/ee/06/d3ee06c64b5f931bb9bd068792b57f39.jpg",
        alternativeText: "Second Slide"
      },
      bannerName: "Second Slide",
      redirectUrl: "Place ad here."
    },
    {
      image: {
        url: "https://i.pinimg.com/564x/36/d8/99/36d899f2e42dda38b99eb1e5eb7e1ccf.jpg",
        alternativeText: "Third Slide"
      },
      bannerName: "Third Slide",
      redirectUrl: "Place ad here."
    },
    {
      image: {
        url: "https://i.pinimg.com/736x/a5/59/e3/a559e3e59fd9a38d909f5e016050e229.jpg",
        alternativeText: "Fourth Slide"
      },
      bannerName: "Fourth Slide",
      redirectUrl: "Place ad here."
    },
    {
      image: {
        url: "https://i.pinimg.com/736x/c0/2d/8f/c02d8f09c7fcd007ace00bb3bca43c7f.jpg",
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