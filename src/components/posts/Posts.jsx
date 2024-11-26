import Post from "../post/Post";
import "./posts.scss";
import { PostsContext } from "../../context/postContext";
import { useContext, useState, useEffect } from "react";

const Posts = () => {
  const { posts } = useContext(PostsContext);
  //TEMPORARY
  // const posts = [
  //     {
  //         id: 1,
  //         name: "Tam Nhu",
  //         userId: 1,
  //         profilePic:"https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //         desc: "I want to share you this beautiful cake",
  //         img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&w=1000&q=80",
  //     },
  //     {
  //         id: 2,
  //         name: "Minh Nhat",
  //         userId: 2,
  //         profilePic:"https://images.unsplash.com/photo-1623230590824-f39e31a0a608?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwYm95fGVufDB8fDB8fA%3D%3D&w=1000&q=80",
  //         desc: "If you want this table, contact to me",
  //         img: "https://media.istockphoto.com/id/614716660/photo/coffee-table-with-top-made-of-different-kinds-of-wood.jpg?s=612x612&w=0&k=20&c=uNFSyVI1hzCnRs_O3PGuFPkG1DheNUg60OpojuJGPz0=",
  //     },
  //     {
  //         id: 3,
  //         name: "Khanh Linh",
  //         userId: 3,
  //         profilePic:"https://cdn.pixabay.com/photo/2017/07/31/22/45/fashion-2561753_960_720.jpg",
  //         desc: "This lovely dog, who want right your hand!",
  //         img: "https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg?cs=srgb&dl=pexels-simona-kidri%C4%8D-2607544.jpg&fm=jpg",
  //         },
  // ];
  return (
    <div className="posts">
      {Array.isArray(posts) &&
        posts.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;
