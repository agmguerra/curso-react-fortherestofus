import React from 'react'
import { Link } from 'react-router-dom';

const Post = ({ post, onClick, showAuthor=true }) => {
  const date = new Date(post.createdDate);
  const dataFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  return (
    <Link 
      onClick={onClick}
      to={`/post/${post._id}`} 
      className="list-group-item list-group-item-action"
    >
      <img className="avatar-tiny" src={post.author.avatar} />
      <strong>{post.title}</strong>{" "}
      <span className="text-muted small">
        {showAuthor ? `by ${post.author.username}` : ""} on {dataFormatted}{" "}
      </span>
    </Link>
  );
}

export default Post
