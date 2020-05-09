import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import Axios from 'axios';
import Page from './Page';
import LoadingDotsIcon from './LoadingDotsIcon';
import ReactMarkdown from 'react-markdown';
import ReactTooltip from 'react-tooltip';

const ViewSinglePost = () => {

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    const fetchPost = async () => {
      try {
        const res = await Axios.get(
          `/post/${id}`, 
          { cancelToken: ourRequest.token }
        );
        setPost(res.data);
        setIsLoading(false);
      } catch (e) {
        console.log("There was a problem or the request was canceled");
      }
    };
    fetchPost();
    return () => {
      //cancela o chamada do axios quando o usuário
      //clicou em algum link antes do resultado chegar
      ourRequest.cancel();
    }
  }, []);

  if (isLoading) 
    return (
      <Page title="..."><LoadingDotsIcon /></Page>
    )

  const date = new Date(post.createdDate);
  const dataFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <a 
            data-tip="Edit"
            data-for="edit"
            href="#" 
            className="text-primary mr-2" 
          >
            <i className="fas fa-edit"></i>
          </a>
          <ReactTooltip id="edit" className="custom-tooltip"/>
          {" "}
          <a 
            data-tip="Delete"
            data-for="delete"
            className="delete-post-button text-danger" 
          >
            <i className="fas fa-trash"></i>
          </a>
          <ReactTooltip id="delete" className="custom-tooltip"/>
        </span>
      </div>
      <p className="text-muted small mb-4">
        <Link 
          to={`/profile/${post.author.username}`}>
          <img 
            className="avatar-tiny" 
            src={post.author.avatar}
          />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dataFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown 
          source={post.body} 
          allowedTypes={
            ["paragraph", "strong", "emphasis", "text", "heading", "list", "listItem"]
          } 
        />
      </div>
    </Page>
  )
}

export default ViewSinglePost
