import { useState, useContext, useEffect } from "react";
import "./submenu.scss"; // Import your CSS file
import { PostsContext } from "../../context/postContext";
import * as Itemserver from "../../server/itemstore";

// Import your local images
import Cloud from './Cloud.png';
import Github from './Github.png';
import Keyboard from './keyboard.png';
import Move from './Move.png';
import Tv from './Tv.png';
import User from './User.png';

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
      <ButtonCategory categoryId="ed35da00-a982-4d4c-8bee-fbe029d232b1" image={Cloud} label="Cloud" />
      <ButtonCategory categoryId="aa062f2a-14fa-4abb-a822-9cbac97e0a63" image={Github} label="Github" />
      <ButtonCategory categoryId="a830190e-c8dc-4e55-96f7-14bd760e9a86" image={Keyboard} label="Keyboard" />
      <ButtonCategory categoryId="24c46936-1329-46d6-aa1b-3e324f804793" image={Move} label="Move" />
      <ButtonCategory categoryId="af18fd57-069e-4a61-88e1-6e7f035bff89" image={Tv} label="TV" />
      <ButtonCategory categoryId="95d55557-2ede-4ba4-a964-db971686908b" image={User} label="User" />
      <ButtonCategory categoryId="95d55557-2ede-4ba4-a964-db971686908b" image={User} label="User" />
    </div>
  );
};

export default CombinedComponent;
