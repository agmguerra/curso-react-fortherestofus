import React, { useEffect } from "react";
import Axios from "axios";
import Page from "./Page";
import { useImmerReducer } from 'use-immer';
import { CSSTransition } from 'react-transition-group'

const HomeGuest = () => {

  const initialState = {
    username: {
      value: '',
      hasErrors: false,
      message: '',
      isUnique: false,
      checkCount: 0
    },
    email: {
      value: '',
      hasErrors: false,
      message: '',
      isUnique: false,
      checkCount: 0
    },
    password: {
      value: '',
      hasErrors: false,
      message: '',
      checkCount: 0
    },
    submitCount: 0
  }

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case 'usernameImmediately':
        draft.username.hasErrors = false
        draft.username.value = action.value
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true;
          draft.username.message = 'Username cannot exceed 30 characters.'
        }
        if (draft.username.value && !/^([a-zA-z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasErrors = true
          draft.username.message = 'Username can only contain letters and numbers.'
        }
        return;
      case 'usernameAfterDelay':
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true
          draft.username.message = 'Username must be at least 3 characters.'
        }
        if (!draft.hasErrors) {
          draft.username.checkCount++
        }
        return;
      case 'usernameUniqueResults':
        if (action.value) {
          draft.username.hasErrors = true
          draft.username.isUnique = false
          draft.username.message = 'That username is already taken.'
        } else {
          draft.username.isUnique = true
        }
        return;
      case 'emailImmediately':
        draft.username.hasErrors = false
        draft.username.value = action.value
        return;
      case 'emailAfterDelay': 
        return ;
      case 'emailUniqueResults':
        return;
      case 'passwordImmediately':
        draft.username.hasErrors = false
        draft.username.value = action.value
        return;
      case 'passwordAfterDelay':
        return;
      case 'submitForm':
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => dispatch({
        type: 'usernameAfterDelay'
      }), 800)

      return () => clearTimeout(delay)
    }
  }, [state.username.value])

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (state.username.checkCount) {
      const ourRequest = Axios.CancelToken.source();
      const fetchResults = async () => {
        try {
          const res = await Axios.post('/doesUsernameExist', {
            username: state.username.value
          }, 
          {
            cancelToken: ourRequest.token
          });
          
          dispatch({ type: 'usernameUniqueResults', value: res.data })
          
        } catch (e) {
          console.log('There was problem or the request was cancelled');    
        }
      } 
      fetchResults();
      return () => ourRequest.cancel();
    }
    
  }, [state.username.checkCount]);

  return (
    <Page title="Welcome" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">Are you sick of short tweets and impersonal &ldquo;shared&rdquo; posts that are reminiscent of the late 90&rsquo;s email forwards? We believe getting back to actually writing is the key to enjoying the internet again.</p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input 
                onChange={e => dispatch({ type: "usernameImmediately", value: e.target.value})} id="username-register" 
                name="username" 
                className="form-control" 
                type="text" 
                placeholder="Pick a username" 
                autoComplete="off" 
              />
              <CSSTransition 
                in={state.username.hasErrors} 
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div 
                  className="alert alert-danger small liveValidateMessage"
                >
                  {state.username.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input 
                onChange={e => dispatch({ type: "emailImmediately", value: e.target.value})}  
                id="email-register" 
                name="email" 
                className="form-control" 
                type="text" 
                placeholder="you@example.com" 
                autoComplete="off" 
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input 
                onChange={e => dispatch({ type: "passwordImmediately", value: e.target.value})}  id="password-register" name="password" className="form-control" 
                type="password" 
                placeholder="Create a password" 
              />
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              Sign up for ComplexApp
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
};

export default HomeGuest;
