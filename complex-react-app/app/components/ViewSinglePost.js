import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, withRouter } from "react-router-dom";
import Axios from "axios";
import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import NotFound from "./NotFound";
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

const ViewSinglePost = (props) => {

  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
    // criado para permitir o cancelamento
    const ourRequest = Axios.CancelToken.source();
    const fetchPost = async () => {
      try {
        const res = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token });
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
    };
  }, [id]);

  if (!isLoading && !post) {
    return <NotFound />;
  }
  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  const date = new Date(post.createdDate);
  const dataFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  const isOwner = () => {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username
    };
    return false;

  };

  const deleteHandler = async () => {
    const areYouSure = window.confirm('Do you really want do delete this post');
    if (areYouSure) {
      try {
        const res = await Axios.delete(`/post/${id}`, {
          data: {token: appState.user.token}
        });
        if (res.data == 'Success') {
          appDispatch({ 
            type: 'flashMessage', 
            value: 'Post was succesfuly deleted.'
          });

          //2. redirect back to current user's profile
          props.history.push(`/profile/${appState.user.username}`);
        }
      } catch (e) {
        console.log('There was a problem');
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link 
              data-tip="Edit" 
              data-for="edit" 
              to={`/post/${post._id}/edit`} 
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a 
              onClick={deleteHandler}
              data-tip="Delete" 
              data-for="delete" 
              className="delete-post-button text-danger"
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>
      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dataFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} allowedTypes={["paragraph", "strong", "emphasis", "text", "heading", "list", "listItem"]} />
      </div>
    </Page>
  );
};

export default withRouter(ViewSinglePost);
