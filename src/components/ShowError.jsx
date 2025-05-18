import React from 'react';
import { MdError } from "react-icons/md";

const ShowError = ({ error = "An error occurred" }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
         <MdError className="w-6 h-6 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );
};

export default ShowError;
