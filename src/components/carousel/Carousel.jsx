// import React from 'react';
// import { Box, Heading, Text, Container } from '@chakra-ui/react';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import { ClassNames } from '@emotion/react';
// import './carousel.scss'

// const CaptionCarousel = () => {
//   const cards = [
//     {
//       title: 'Design Projects 1',
//       text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
//       width: '50%', // Set the desired width, you can use pixels or percentage
//       image:
//         'https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60',
//     },
//     {
//       title: 'Design Projects 2',
//       text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
//       width: '50%', // Set the desired width, you can use pixels or percentage
//       image:
//         'https://images.unsplash.com/photo-1438183972690-6d4658e3290e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2274&q=80',
//     },
//     {
//       title: 'Design Projects 3',
//       text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
//       width: '50%', // Set the desired width, you can use pixels or percentage
//       image:
//         'https://images.unsplash.com/photo-1507237998874-b4d52d1dd655?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60',
//     },
//     // Add more cards as needed
//   ];

//   const settings = {
//     dots: true,
//     arrows: false,
//     fade: true,
//     infinite: true,
//     autoplay: true,
//     speed: 500,
//     autoplaySpeed: 300,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//   };

//   return (
//     <div className="carousel">
//     <Box position={'relative'} height={'300px'} width={'100%'} borderRadius={"16px"} overflow={'hidden'} margin-bottom={ '10px'}>
//       <Slider {...settings}>
//         {cards.map((card, index) => (
//           <Box
//             key={index}
//             height={card.height}
//             width={card.width}
//             position="relative"
//             backgroundPosition="center"
//             backgroundRepeat="no-repeat"
//             backgroundSize="cover"
//             backgroundImage={`url(${card.image})`}>
//             <Container size="container.lg" height="300px" width='100%' position="relative">
//               <Box
//                 position="absolute"
//                 top="50%"
//                 transform="translate(0, -50%)"
//                 textAlign="center"
//                 color="white">
//                 <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
//                   {card.title}
//                 </Heading>
//                 <Text fontSize={{ base: 'md', lg: 'lg' }}>{card.text}</Text>
//               </Box>
//             </Container>
//           </Box>
//         ))}
//       </Slider>
//     </Box>
//     </div>
//   );
// };

// export default CaptionCarousel;
import React from 'react';
import { Box, Heading, Text, Container } from '@chakra-ui/react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// import './carousel.scss'


const CaptionCarousel = () => {
  const cards = [
    {
      image: 'https://i.pinimg.com/564x/1e/db/c2/1edbc2367a605156d052c8fb415063a8.jpg',
      height: '50%',
      width: '50%', // Set the desired width, you can use pixels or percentage
      // Add more properties as needed
    },
    {
      image: 'https://i.pinimg.com/564x/d3/ee/06/d3ee06c64b5f931bb9bd068792b57f39.jpg',
      height: '50%',
      width: '50%', // Set the desired width, you can use pixels or percentage
      // Add more properties as needed
    },
    {
      image: 'https://i.pinimg.com/564x/36/d8/99/36d899f2e42dda38b99eb1e5eb7e1ccf.jpg',
      height: '50%',
      width: '50%', // Set the desired width, you can use pixels or percentage
      // Add more properties as needed
    },
    // Add more cards as needed
  ];

  const settings = {
    fitWidth : true,
    dots: true,
    arrows: false,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="carousel">
    <Box position={'relative'} height={'400px'} width={'1000px'} borderRadius={"16px"} overflow={'hidden'} marginBottom={ '10px'} >
      <Slider {...settings}>
        {cards.map((card, index) => (
          <Box
            key={index}
            height={card.height}
            width={card.width}
            position="relative"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            backgroundImage={`url(${card.image})`}>
            <Container size="container.lg" height="400px" width='1000vw' position="relative">
              <Box
                position="absolute"
                top="50%"
                transform="translate(0, -50%)"
                textAlign="center"
                color="white">
                <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                  {card.title}
                </Heading>
                <Text fontSize={{ base: 'md', lg: 'lg' }}>{card.text}</Text>
              </Box>
            </Container>
          </Box>
        ))}
      </Slider>
    </Box>
    </div>
  );
};

export default CaptionCarousel;
