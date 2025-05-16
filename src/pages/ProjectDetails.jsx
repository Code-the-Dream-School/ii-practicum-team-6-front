import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import codeCrewAPI from '../config.js';
import ProjectDetailsCard from '../components/ProjectDetailsCard';
import IsLoading from '../components/IsLoading';
import ShowError from '../components/ShowError.jsx';

const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;

      setIsLoading(true);
      try {
        const {data} = await codeCrewAPI.getProject(projectId);
        setProject(data?.data?.project || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch project details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  return {project, isLoading, error};
};

const ProjectDetails = () => {
  const {id} = useParams();
  const {project, isLoading, error} = useProject(id);

  if (isLoading) {
    return <IsLoading message="Loading projects..."/>;
  }

  if (error) {
    return <ShowError error={error}/>;
  }

  if (!project) {
    return <ShowError error={error}/>;
  }


  return (
      <div className="bg-gray-100 ">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <ProjectDetailsCard project={project}/>
        </div>
      </div>
  );

};

export default ProjectDetails;
