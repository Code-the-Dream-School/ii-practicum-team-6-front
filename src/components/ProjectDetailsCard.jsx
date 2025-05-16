import React from 'react';
import RequestJoin from './RequestJoin';
import ReviewRequests from './ReviewRequests';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'});
};

const ProjectDetailsCard = ({project}) => {
    const teamFilled = project.teamMembers.length / project.reqSpots * 100;
    return (

        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                    <p className="text-gray-600 mt-1">{project.description}</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-500">Created {formatDate(project.createdAt)}</span>
                </div>
            </div>

            {project.reqSkills && project.reqSkills.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                        {project.reqSkills.map((skill,id) => (
                            <span
                                key={id}
                                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs"
                            >
                                       {skill}
                                 </span>
                        ))}
                    </div>
                </div>
            )}
            <div className="mb-4">
                <div className="flex justify-between mb-1">
                        <span
                            className="text-sm text-gray-600">Team ({project.teamMembers.length} of {project.reqSpots} spots filled)</span>
                    <span className="text-sm text-gray-600">{Math.ceil(teamFilled)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{width: `${teamFilled}%`}}
                    ></div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Team Members
                    ({project.teamMembers.length}):</h4>
                <div className="space-y-2">
                    {project.teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div
                                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                                    {member.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm text-gray-800">{member.username}</span>
                            </div>
                            <span
                                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs capitalize">{member.role}</span>
                        </div>
                    ))}
                </div>
            </div>

            <RequestJoin projectId={project._id} project={project}/>

            <ReviewRequests project={project}/>
        </div>

    );
};

export default ProjectDetailsCard;
