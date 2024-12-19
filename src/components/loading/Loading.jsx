import React from 'react';
import './Loading.scss';

const Loading = () => {
  return (
    <div className="overlayLoading">
      <div className="container">
        <div className="box1"></div>
        <div className="box2"></div>
        <div className="box3"></div>
      </div>
    </div>
  );
};

export default Loading;