import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import codeCrewAPI from '../config';
import IsLoading from './IsLoading';
import ShowError from './ShowError';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const ReviewRequests = ({ project }) => {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [joinRequests, setJoinRequests] = useState([]);

    const isAdmin = user && project.teamMembers.some(member => member.id === user.id && member.role === "admin");

    useEffect(() => {
        const fetchJoinRequests = async () => {
            if (!isAdmin) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await codeCrewAPI.getProjectJoinRequests(project._id);
                const requests = response.data?.data?.request || [];
                setJoinRequests(requests);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch join requests');
            } finally {
                setIsLoading(false);
            }
        };

        fetchJoinRequests();
    }, [project._id, isAdmin]);

    const handleApproveRequest = async (projectId, requestId) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await codeCrewAPI.reviewJoinRequest(projectId, requestId, {
                action: "approve"
            });
            setSuccessMessage(`Request approved successfully!`);

            const updatedRequests = joinRequests.filter(req => req._id !== requestId);
            setJoinRequests(updatedRequests);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to approve request');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRejectRequest = async (projectId, requestId) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await codeCrewAPI.reviewJoinRequest(projectId, requestId, {
                action: "decline"
            });
            setSuccessMessage(`Request rejected successfully!`);
            const updatedRequests = joinRequests.filter(req => req._id !== requestId);
            setJoinRequests(updatedRequests);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reject request');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="mt-4 border-t border-gray-200">
            {isLoading && <IsLoading message={"Loading join requests..."} />}
            {error && <ShowError error={error} />}
            {successMessage && (
                <div className="mb-4 mt-4 p-2 bg-green-100 text-green-800 rounded">
                    {successMessage}
                </div>
            )}

            {!isLoading && joinRequests.filter(request => request.status === "pending" || request.status === "declined").length === 0 ? (
                <p className="mt-4 text-sm text-gray-600">No join requests.</p>
            ) : (
                <>
                    <h4 className="mt-4 text-sm font-medium text-gray-700 mb-2">Join Requests:</h4>
                    <div className="space-y-3">
                        {joinRequests.filter(request => request.status === "pending" || request.status === "declined").map((request) => (
                            <div key={request._id} className="bg-gray-50 p-3 rounded">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <div
                                            className="w-8 h-8 bg-[#d4dfbd] rounded-full flex items-center justify-center mr-2">
                                            {request.avatar ? (
                                                <img
                                                    src={request.avatar}
                                                    alt={`${request.username}'s avatar`}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                request.username.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <span className="text-sm font-medium">{request.username}</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        {request.status === "pending" ? (
                                            <>
                                                <button
                                                    onClick={() => handleApproveRequest(project._id, request._id)}
                                                    className="bg-green-100 hover:bg-green-200 text-green-800 text-xs p-1 rounded flex items-center"
                                                    disabled={isLoading}
                                                >
                                                    <FiCheckCircle className="w-4 h-4 mr-1" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRejectRequest(project._id, request._id)}
                                                    className="bg-red-100 hover:bg-red-200 text-red-800 text-xs p-1 rounded flex items-center"
                                                    disabled={isLoading }
                                                >
                                                    <FiXCircle className="w-4 h-4 mr-1" />
                                                    Reject
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-800 capitalize">
                                                {request.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600">{request.joinMessage}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ReviewRequests;
