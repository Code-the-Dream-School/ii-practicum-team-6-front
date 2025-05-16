import { CiHeart } from "react-icons/ci";
import { useState } from 'react';
import codeCrewAPI from '../config.js';

const LikeButton = ({ projectId, initialLiked = false, initialLikesCount = 0 }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const response = await codeCrewAPI.toggleVote(projectId);
      if (response.data.success) {
        const { likesCount: newLikesCount } = response.data.data;
        setLiked(!liked);
        setLikesCount(newLikesCount);
      }
    } catch (error) {
      console.error('Error toggling vote:', error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="text-gray-400 hover:text-red-500 transition-colors flex items-center"
    >
      <CiHeart
        className={`h-5 w-5 ${liked ? 'text-red-500' : 'text-gray-400'}`}
        style={{fill: liked ? '#ef4444' : '#9ca3af', stroke: liked ? '#ef4444' : '#9ca3af'}}
      />
      <span className="ml-1 text-sm">{likesCount}</span>
    </button>
  );
};

export default LikeButton;
