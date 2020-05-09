import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";

const ProfilePosts = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await Axios.get(`/profile/${username}/posts`);
        setIsLoading(false);
        setPosts(res.data);
      } catch (e) {
        console.log("There was a problem.");
      }
    };
    fetchPosts();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="list-group">
      {posts.map((post) => {
        const date = new Date(post.createdDate);
        const dataFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        return (
          <Link
            key={post._id} 
            to={`/post/${post._id}`} 
            className="list-group-item list-group-item-action"
          >
            <img 
              className="avatar-tiny" 
              src={post.author.avatar} 
            /> 
            <strong>{post.title}</strong>{' '}
            <span className="text-muted small">on {dataFormatted} </span>
          </Link>
        );
      })}
    </div>
  );
};

export default ProfilePosts;
