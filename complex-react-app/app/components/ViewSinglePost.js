import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import Page from './Page';
import { useParams, Link } from 'react-router-dom';

const ViewSinglePost = () => {

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await Axios.get(`/post/${id}`);
        setPost(res.data);
        setIsLoading(false);
      } catch (e) {
        console.log("There was a problem.");
      }
    };
    fetchPost();
  }, []);

  if (isLoading) return <Page title="..."><div>Loading...</div></Page>

  const date = new Date(post.createdDate);
  const dataFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <a href="#" className="text-primary mr-2" title="Edit"><i className="fas fa-edit"></i></a>
          <a className="delete-post-button text-danger" title="Delete"><i className="fas fa-trash"></i></a>
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dataFormatted}
      </p>

      <div className="body-content">
        <p>{post.body}</p>
      </div>
    </Page>
  )
}

export default ViewSinglePost
