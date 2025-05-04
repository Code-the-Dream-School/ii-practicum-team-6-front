import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
//import API_URL from '../config';
import ProjectCard from './ProjectCard';

const Featured = () => {
  const API_URL = 'http://localhost:3000/api';
  const [projects, setProjects] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {

      setIsLoading(true);
      try {
        const {data} = await axios.get(`${API_URL}/projects/`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          params: {
            limit: 5,
            sort: 'mostLiked'
          }
        });
        setProjects(data?.data?.projects || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, []);

  return {projects, isLoading, error};
};

const FeaturedProjects = () => {
  const {projects, isLoading, error} = Featured();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading featured project details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!projects) {
    return <div>No featured projects</div>;
  }


  const handleLike = (id) => {
    /*setProjects(projects.map(project =>
        project.id === id ? {
          ...project,
          liked: !project.liked,
          likes: project.liked ? project.likes - 1 : project.likes + 1
        } : project
    ));*/
  };


  const handleCardClick = (id) => {
    navigate(`/projects/${id}`);
  };

  return (

      <section className="  py-8 px-4">
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
                        onLike={handleLike}
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
