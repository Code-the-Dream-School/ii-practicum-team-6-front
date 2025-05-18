import LikeButton from './LikeButton';

const ProjectCard = ({project, onClick, onSkillClick}) => {
  const id = project._id;
  const title = project.title;
  const description = project.description;
    const likes = project.likes.length || 0;
  const tags = project.reqSkills || [];
  const teamSize = project.reqSpots || 0;
  const contributors = project.teamMembers?.length || 0;

  return (
      <div
          className="w-64 bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onClick(id)}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <LikeButton
                projectId={id}
                likes={project.likes || []}
                initialLikesCount={likes}
            />
        </div>

        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, id) => (
              <span
                  key={id}
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSkillClick) onSkillClick(tag);
                  }}>
                  {tag}
              </span>
            ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Team size: {teamSize}
          </div>
          <div className="text-sm text-gray-500">{teamSize - contributors} spots left</div>
        </div>
      </div>
  );
};

export default ProjectCard;
