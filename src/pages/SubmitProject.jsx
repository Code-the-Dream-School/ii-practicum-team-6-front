import React, {useState} from 'react';
import Select from 'react-select';
import codeCrewAPI from "../config.js";
import {useNavigate} from 'react-router-dom';
import ShowError from '../components/ShowError';
import useLoadSkills from '../hooks/useLoadSkills';

const SubmitProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: [],
    teamSize: 3,
  });

  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const {formattedSkillOptions, isLoading, loadError} = useLoadSkills();


  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});

    if (errors[name]) {
      setErrors({...errors, [name]: ''});
    }
  };

  const handleSkillsChange = (selectedOptions) => {
    const selectedSkills = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData({
      ...formData,
      skills: selectedSkills
    });

    if (errors.skills) {
      setErrors({...errors, skills: ''});
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    } else if (formData.description.trim().length < 50) {
      newErrors.description = 'Description should be at least 50 characters';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'Please select at least one required skill';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const projectData = {
        title: formData.title,
        description: formData.description,
        reqSpots: formData.teamSize,
        reqSkills: formData.skills
      };

      codeCrewAPI.createProject(projectData)
          .then(response => {
            if (response.data.success) {
              alert(response.data.message || 'Project successfully submitted!');
              navigate('/projects/');
            } else {
              alert(response.data.message || 'Error creating the project');
            }
          })
          .catch(error => {
            console.error('Error creating project:', error);
            alert('Error creating the project. Please try again.');
          });
    }
  };

  return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit Project</h1>
          <p className="text-gray-600 mt-2">Share your project idea and find teammates to collaborate with</p>
        </div>

        {!showPreview ? (
            <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter a clear, descriptive title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>

              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="6"
                    className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Describe your project idea in detail. What problem does it solve? What technologies will you use? What are your goals?"
                ></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.description.length} / 1000 characters (minimum 50)
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills <span className="text-red-500">*</span>
                </label>
                {loadError && <ShowError error={loadError}/>}
                <Select
                    isMulti
                    name="skills"
                    options={formattedSkillOptions}
                    classNamePrefix="select"
                    placeholder={isLoading ? "Loading skills..." : "Select required skills"}
                    value={formData.skills.map(skill => ({value: skill, label: skill}))}
                    onChange={handleSkillsChange}
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: errors.skills ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
                        boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                        '&:hover': {
                          borderColor: state.isFocused ? '#3b82f6' : '#d1d5db'
                        }
                      })
                    }}
                />
                {errors.skills && <p className="mt-1 text-sm text-red-500">{errors.skills}</p>}
                <p className="mt-1 text-sm text-gray-500">
                  Selected: {formData.skills.length} / {formattedSkillOptions.length}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Team Size
                  </label>
                  <select
                      id="teamSize"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                        <option key={size} value={size}>{size} members</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={handlePreview}
                    className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Preview Project
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Project
                </button>
              </div>
            </form>
        ) : (
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Project Preview</h2>
                <button
                    onClick={() => setShowPreview(false)}
                    className="text-blue-600 hover:text-blue-800"
                >
                  Edit Project
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{formData.title}</h3>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-800 whitespace-pre-line">{formData.description}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                      <span
                          key={skill}
                          className="text-xs px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full border border-gray-200"
                      >
                  {skill}
                </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Team Information</h4>
                <p className="text-gray-800">Looking for a team of {formData.teamSize} members</p>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Project
                </button>
              </div>
            </div>
        )}
      </div>
  );
};

export default SubmitProject;
