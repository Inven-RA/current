import React from 'react';

const BackButton = () => {
  const goBack = () => {
    window.history.go(-1); // Navigate back to the previous page
  };

  return (
    <button class="button-17" onClick={goBack}>Go Back</button>
  );
};

export default BackButton;
