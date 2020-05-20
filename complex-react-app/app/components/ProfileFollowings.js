import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from './LoadingDotsIcon';

const ProfileFollowings = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    //Usar para cancelar o call do axios se o usuario
    //clicar em um link
    const ourRequest = Axios.CancelToken.source();
    const fetchPosts = async () => {
      try {
        const res = await Axios.get(
          `/profile/${username}/following`, 
          { cancelToken: ourRequest.token }
        );
        setIsLoading(false);
        console.log(res.data);
        
        setPosts(res.data);
      } catch (e) {
        console.log("There was a problem.");
      }
    };
    fetchPosts();
    return () => {
      //cancela o chamada do axios quando o usuário
      //clicou em algum link antes do resultado chegar
      ourRequest.cancel();
    }
  }, [username]);

  if (isLoading) return <LoadingDotsIcon />

  return (
    <div className="list-group">
      {posts.map((following, index) => {
        return (
          <Link
            key={index} 
            to={`/profile/${following.username}`} 
            className="list-group-item list-group-item-action"
          >
            <img 
              className="avatar-tiny" 
              src={following.avatar} 
            /> {following.username}
          </Link>
        );
      })}
    </div>
  );
};

export default ProfileFollowings;
