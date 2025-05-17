import React, {useState, useEffect} from 'react';
import {useUser} from '../context/UserContext';
import {Link} from 'react-router-dom';
import codeCrewAPI from '../config';
import IsLoading from './IsLoading';
import ShowError from './ShowError';

const RequestJoin = ({projectId, project}) => {
    const {user} = useUser();
    const [joinMessage, setJoinMessage] = useState('');
    const [showJoinForm, setShowJoinForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingRequests, setIsFetchingRequests] = useState(false);
    const [error, setError] = useState(null);
    const [requestSent, setRequestSent] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);
    const [requestWithdrawn, setRequestWithdrawn] = useState(false);

    // Return null if user is not logged in or is already a team member
    if (!user)
        return (
            <div className="text-center">
                <Link to="/register"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Register to join a project
                </Link>
            </div>
        );
    else if (project && project.teamMembers.some(member => member.id === user.id)) {
        return null;
    }

    useEffect(() => {
        const fetchProjectRequests = async () => {
            if (!user) return;

            setIsFetchingRequests(true);
            try {
                const response = await codeCrewAPI.getMyProjectRequests();
                const requests = response.data.data.projects || [];
                const request = requests.find(req => req.projectId === projectId);
                if (request) {
                    setCurrentRequest(request);
                }
            } catch (err) {
                if (err.response?.data?.message != "No data found")
                    setError(err.response?.data?.message || 'Failed to fetch project requests');
            } finally {
                setIsFetchingRequests(false);
            }
        };

        fetchProjectRequests();
    }, [user, projectId]);

    const handleJoinRequest = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await codeCrewAPI.sendJoinRequest(projectId, {
                userId: user.id,
                joinMessage: joinMessage
            });
            setRequestSent(true);
            setShowJoinForm(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send join request');
        } finally {
            setIsLoading(false);
        }
    };

    const handleWithdrawRequest = async () => {
        setIsLoading(true);
        setError(null);
        setRequestWithdrawn(false);

        try {
            await codeCrewAPI.unsendJoinRequest(projectId, {
                userId: user.id
            });
            setCurrentRequest(null);
            setRequestWithdrawn(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to withdraw join request');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-6 pt-4 border-t border-gray-200">
            {isLoading && <IsLoading message={currentRequest ? "Withdrawing request..." : "Sending request..."}/>}
            {isFetchingRequests && <IsLoading message="Checking request status..."/>}
            {error && <ShowError error={error}/>}

            {!user ? (
                <div className="text-center">
                    <Link to="/register"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        Register to join a project
                    </Link>
                </div>
            ) : requestWithdrawn ? (
                <div className="text-center py-2">
                    <p className="text-green-600 font-medium">Your request has been withdrawn successfully!</p>
                </div>
            ) : currentRequest ? (
                <div className="text-center py-2">
                    <p className={`font-medium ${currentRequest.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                        Your request to join this project is {currentRequest.status}.
                    </p>
                    {currentRequest.status === 'pending' && (
                        <button
                            onClick={handleWithdrawRequest}
                            className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-600 bg-white hover:bg-gray-50"
                            disabled={isLoading}
                        >
                            Withdraw Request
                        </button>
                    )}
                </div>
            ) : requestSent ? (
                <div className="text-center py-2">
                    <p className="text-green-600 font-medium">Your request to join this project has been sent!</p>
                </div>
            ) : showJoinForm ? (
                <div className="p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Send a request to join this project</h4>
                    <form onSubmit={handleJoinRequest}>
                        <div className="mb-4">
                            <label htmlFor="joinMessage" className="block text-sm font-medium text-gray-700 mb-1">
                                Message
                            </label>
                            <textarea
                                id="joinMessage"
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Tell the project owner why you'd like to join..."
                                value={joinMessage}
                                onChange={(e) => setJoinMessage(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                onClick={() => setShowJoinForm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                disabled={isLoading}
                            >
                                Send Request
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="text-center">
                    <button
                        onClick={() => setShowJoinForm(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Request to join project
                    </button>
                </div>
            )}
        </div>
    );
};

export default RequestJoin;
