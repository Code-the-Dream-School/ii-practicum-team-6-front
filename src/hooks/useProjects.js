import {useState, useEffect} from 'react';
import codeCrewAPI from '../config.js';

const useProjects = (params = {}) => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            try {
                const response = await codeCrewAPI.getProjects({
                    params
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
    }, [params]);

    return {projects, setProjects, isLoading, error};
};

export default useProjects;
