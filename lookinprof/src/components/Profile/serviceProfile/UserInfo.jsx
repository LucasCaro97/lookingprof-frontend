import React from 'react'
import StarRating from "./StarRating"

const UserInfo = ({ text, className, valoration }) => {
  return (
    <div className={`text-center ${className}`}>
      
      {valoration ? (
        <StarRating rating={valoration}  />
      ) : (
        <input type="text" className='text-center text-sm whitespace-normal w-full focus:outline-none cursor-default' value={text} readOnly />
      )}
    </div>
  );
};

export default UserInfo