import React from 'react';

const IsLoading = ({ message = "Loading..." }) => {
  return (
    <div className="text-center py-12">
      <div
        className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default IsLoading;
