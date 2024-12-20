import { useState, useContext, useEffect } from "react";
import "./submenu.scss"; // Import your CSS file
import { PostsContext } from "../../context/postContext";
import * as Itemserver from "../../server/itemstore";


// Import your local images
import MonitorSmartphone from './monitor-smartphone.png';
import Sport from './trophy.png';
import Fashion from './shirt.png';
import Food from './concierge-bell.png';
import Pet from './paw-print.png';
import Technology from './cpu.png';
import All from './expand.png';

const ButtonCategory = ({ categoryId, image, label }) => {
  const { setPosts, setCategoryIds } = useContext(PostsContext);

  const handleButtonClick = async () => {
    await setCategoryIds("");  // Clear previous category
    try {
      setCategoryIds(categoryId);
      console.log('categoryId', categoryId);
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const posts = await Itemserver.getPostByCategoryId(categoryId, accessToken, 12);
      setPosts(posts.listData);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="button-category" onClick={handleButtonClick}>
      <img className="img-category" src={image} alt={label} />
      <p>{label}</p>
    </div>
  );
};

const CombinedComponent = () => {
  return (
    <div className="button-frame-container">
      <ButtonCategory categoryId="da56aeb0-2653-494b-96a1-4fe81e3f4d51" image={MonitorSmartphone} label="Household" />
      <ButtonCategory categoryId="e2af9faa-67d7-4b68-af10-64d9e15ef91f" image={Sport} label="Sport" />
      <ButtonCategory categoryId="5d0dca3f-bd6d-4a4f-8bc3-11be84b34557" image={Fashion} label="Fashion" />
      <ButtonCategory categoryId="01a407d6-eaa3-413d-bbc5-fbf365653cc2" image={Food} label="Food" />
      <ButtonCategory categoryId="80e175cd-0958-495f-8dd7-02921c306ccd" image={Pet} label="Pet" />
      <ButtonCategory categoryId="93aeb35d-5fa9-425c-b393-457682e1716c" image={Technology} label="Technology" />
      <ButtonCategory categoryId="" image={All} label="All" />
    </div>
  );
};

export default CombinedComponent;
