import { useState, useEffect } from 'react';
import codeCrewAPI from '../config.js';

const useLoadSkills = () => {
  const [formattedSkillOptions, setFormattedSkillOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setLoadError(null);

    codeCrewAPI.getAllSkills()
      .then(response => {
        if (response.data && response.data.data && Array.isArray(response.data.data.skills)) {
          const skills = response.data.data.skills;
          const formatted = skills.map(skill => ({
            value: skill,
            label: skill
          }));
          setFormattedSkillOptions(formatted);
        } else {
          console.error('Unexpected API response format:', response.data);
          setLoadError('Failed to load skills. Unexpected response format.');
        }
      })
      .catch(error => {
        console.error('Error fetching skills:', error);
        setLoadError('Failed to load skills. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { formattedSkillOptions, isLoading, loadError };
};

export default useLoadSkills;
