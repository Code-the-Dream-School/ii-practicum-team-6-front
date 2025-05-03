import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import API_URL from '../config';
import axios from 'axios';

const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;

      setIsLoading(true);
      try {
        const {data} = await axios.get(`${API_URL}projects/${projectId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log(data.data.project);
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
    return <div>Loading project details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }


  return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{project.title}</h1>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-600">{project.description}</p>
            </div>
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {project.reqSkills.map((skill, index) => (
                    <span
                        key={index}
                        className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                    >
                  {skill}
                </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Team Information</h2>
                <div className="space-y-2 text-gray-600">
                  <p>Team Size: {project.reqSpots}</p>
                  <p>Spots Available: {project.reqSpots - project.teamMembers.length}</p>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
  );

};

export default ProjectDetails;
