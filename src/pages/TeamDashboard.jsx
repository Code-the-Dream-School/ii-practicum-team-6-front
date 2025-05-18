import React, {useState, useEffect} from 'react';
import {useUser} from "../context/UserContext";
import ProjectDetailsCard from '../components/ProjectDetailsCard';
import IsLoading from '../components/IsLoading';
import ShowError from '../components/ShowError.jsx';
import {Link} from 'react-router-dom';
import codeCrewAPI from '../config.js';


function TeamDashboard() {
    const [activeTab, setActiveTab] = useState('created');
    const {user} = useUser();
    const [createdProjects, setCreatedProjects] = useState([]);
    const [joinedProjects, setJoinedProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            try {
                const createdResponse = await codeCrewAPI.getMyCreatedProjects({
                    limit: 36,
                    page: 1,
                });
                const createdProjectsData = createdResponse.data?.data?.projects || [];
                setCreatedProjects(Object.values(createdProjectsData));
            } catch (err) {
                if (!(["No data found", "No projects"].includes(err.response?.data?.message))) {
                    console.error('Error fetching projects:', err);
                    setError(err.response?.data?.message || 'Failed to fetch projects');
                }
            } finally {
                setIsLoading(false);
            }
            try {
                const joinedResponse = await codeCrewAPI.getMyProjectRequests({
                    limit: 36,
                    page: 1,
                });
                const projectRequests = joinedResponse.data?.data?.projects || [];

                const joinedProjectsData = [];
                for (const request of projectRequests) {
                    try {
                        const projectResponse = await codeCrewAPI.getProject(request.projectId);
                        const projectData = projectResponse.data?.data?.project;
                        if (projectData) {
                            projectData.requestData = request;
                            joinedProjectsData.push(projectData);
                        }
                    } catch (projectErr) {
                        console.error(`Error fetching project ${request.projectId}:`, projectErr);
                    }
                }

                setJoinedProjects(joinedProjectsData);
            } catch (err) {
                if (!(["No data found", "No projects"].includes(err.response?.data?.message))) {
                    console.error('Error fetching projects:', err);
                    setError(err.response?.data?.message || 'Failed to fetch projects');
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchProjects();
        }
    }, [user]);


    return (
        <div className="min-h-screen bg-gray-100 ">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Team Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your projects and team memberships
                    </p>
                </div>

                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('created')}
                                className={`
                  ${activeTab === 'created'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                `}
                            >
                                Created Projects
                            </button>
                            <button
                                onClick={() => setActiveTab('joined')}
                                className={`
                  ${activeTab === 'joined'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                `}
                            >
                                Joined Projects
                            </button>
                        </nav>
                    </div>
                </div>


                <div className="mt-6">
                    {error && <ShowError error={error}/>}

                    {isLoading ? (
                        <IsLoading message="Loading projects..."/>
                    ) : (
                        <>
                            {activeTab === 'created' && (
                                <>
                                    {createdProjects.length > 0 ? (
                                        <div className="space-y-4">
                                            {createdProjects.map(project => (
                                                <ProjectDetailsCard
                                                    key={project._id}
                                                    project={project}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects
                                                created</h3>
                                            <div className="mt-6">
                                                <Link to="/projects/new"
                                                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                                    Create Project
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'joined' && (
                                <>
                                    {joinedProjects.length > 0 ? (
                                        <div className="space-y-4">
                                            {joinedProjects.map(project => (
                                                <ProjectDetailsCard
                                                    key={project._id}
                                                    project={project}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">Browse available
                                                projects to
                                                join.</h3>
                                            <div className="mt-6">
                                                <Link to="/projects"
                                                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                                    Browse Projects
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default TeamDashboard;
