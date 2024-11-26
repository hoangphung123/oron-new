import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DarkModeContextProvider } from './context/darkModeContext';
import { AuthContextProvider } from './context/authContext';
import { PostsProvider, usePosts } from "./context/postContext.js";
// import "indess.css"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DarkModeContextProvider>
          <AuthContextProvider>
            <PostsProvider>
              <App />
            </PostsProvider>
          </AuthContextProvider>
    </DarkModeContextProvider>
    
  </React.StrictMode>
);