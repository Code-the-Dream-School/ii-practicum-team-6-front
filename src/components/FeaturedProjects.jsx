import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ProjectCard from './ProjectCard';
import codeCrewAPI from '../config.js';

const useFeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
          const response = await codeCrewAPI.getProjects({
          params: {
            limit: 4,
            page: 1,
            sort: 'mostLiked'
          }
        });
        const apiProjects = response.data?.data?.projects || [];
        setProjects(Object.values(apiProjects));
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.response?.data?.message || 'Failed to fetch projects');
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return {projects, setProjects, isLoading, error};
};

const FeaturedProjects = () => {
  const {projects, setProjects, isLoading, error} = useFeaturedProjects();


    const navigate = useNavigate();
    const handleCardClick = (id) => {
        navigate(`/projects/${id}`);
    };

  if (isLoading) {
    return (
        <section className="py-8 px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Featured Projects</h2>
          <div className="flex justify-center">
            <div>Loading featured projects...</div>
          </div>
        </section>
    );
  }

  if (error) {
    return (
        <section className="py-8 px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Featured Projects</h2>
          <div className="flex justify-center">
            <div>Error: {error}</div>
          </div>
        </section>
    );
  }

  return (
      <section className="py-8 px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Featured Projects</h2>
        <div className="flex justify-center">
          <div className="max-w-full overflow-x-auto pb-6 scrollbar-hide">
            <div className="flex space-x-6 px-4 justify-center">
              {projects.map((project, index) => (
                <div
                    key={project._id}
                  className={`${index > 0 ? 'hidden' : ''} sm:block ${index > 1 ? 'sm:hidden' : ''} md:block`}
                >
                  <ProjectCard
                    project={project}
                    onClick={handleCardClick}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
};


export default FeaturedProjects;
