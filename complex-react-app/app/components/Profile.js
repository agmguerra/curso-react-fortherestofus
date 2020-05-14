import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Page from "./Page";
import Axios from "axios";
import StateContext from "../StateContext";
import ProfilePost from "./ProfilePosts";
import { useImmer } from "use-immer";

const Profile = () => {
  const { username } = useParams();

  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: { postCount: "", followerCount: "", followingCount: "" },
    },
  });
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    const fetchData = async () => {
      try {
        const res = await Axios.post(`/profile/${username}`, { token: appState.user.token }, { cancelToken: ourRequest.token });
        setState((draft) => {
          draft.profileData = res.data;
        });
      } catch (e) {
        console.log("There was a problem.");
      }
    };
    fetchData();
    return () => {
      //cancela o chamada do axios quando o usuário
      //clicou em algum link antes do resultado chegar
      ourRequest.cancel();
    };
  }, [username]);

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true;
      })
      const ourRequest = Axios.CancelToken.source();
      
      const fetchData = async () => {
        try {
          const res = await Axios.post(
            `/addFollow/${state.profileData.profileUsername}`, 
            { token: appState.user.token }, 
            { cancelToken: ourRequest.token }
          );
          setState((draft) => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
        } catch (e) {
          console.log("There was a problem.");
        }
      };
      fetchData();
      return () => {
        //cancela o chamada do axios quando o usuário
        //clicou em algum link antes do resultado chegar
        ourRequest.cancel();
      };
    }
  }, [state.startFollowingRequestCount]);

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true;
      })
      const ourRequest = Axios.CancelToken.source();
      
      const fetchData = async () => {
        try {
          const res = await Axios.post(
            `/removeFollow/${state.profileData.profileUsername}`, 
            { token: appState.user.token }, 
            { cancelToken: ourRequest.token }
          );
          setState((draft) => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });
        } catch (e) {
          console.log("There was a problem.");
        }
      };
      fetchData();
      return () => {
        //cancela o chamada do axios quando o usuário
        //clicou em algum link antes do resultado chegar
        ourRequest.cancel();
      };
    }
  }, [state.stopFollowingRequestCount]);

  const startFollowing = () => {
    setState((draft) => {
      draft.startFollowingRequestCount++;
    });
  };

  const stopFollowing = () => {
    setState((draft) => {
      draft.stopFollowingRequestCount++;
    });
  };

  return (
    <Page title="Profile Screen">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
        {appState.loggedIn && !state.profileData.isFollowing && appState.user.username !== state.profileData.profileUsername && state.profileData.username !== "..." && (
          <button 
            onClick={startFollowing} 
            disabled={state.followActionLoading} 
            className="btn btn-primary btn-sm ml-2"
          >
            Follow <i className="fas fa-user-plus"></i>
          </button>
        )}
        {appState.loggedIn && state.profileData.isFollowing && appState.user.username !== state.profileData.profileUsername && state.profileData.username !== "..." && (
          <button 
            onClick={stopFollowing} 
            disabled={state.followActionLoading} 
            className="btn btn-danger btn-sm ml-2"
          >
            Stop Following <i className="fas fa-user-times"></i>
          </button>
        )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </a>
      </div>
      <ProfilePost />
    </Page>
  );
};

export default Profile;
