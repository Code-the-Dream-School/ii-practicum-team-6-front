import {HiHeart} from "react-icons/hi";
import {useState, useEffect} from 'react';
import codeCrewAPI from '../config.js';
import {useUser} from '../context/UserContext';

const LikeButton = ({projectId, initialLikesCount = 0, likes = []}) => {
  const {user} = useUser();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  useEffect(() => {
    if (user && likes.includes(user.id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

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
      <HiHeart
        className={`h-5 w-5 ${liked ? 'text-red-500' : 'text-gray-400'}`}
        style={{fill: liked ? '#ef4444' : '#9ca3af', stroke: liked ? '#ef4444' : '#9ca3af'}}
      />
      <span className="ml-1 text-sm">{likesCount}</span>
    </button>
  );
};

export default LikeButton;
