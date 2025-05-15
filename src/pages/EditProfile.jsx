import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import codeCrewAPI from '../config';
import { useUser } from '../context/UserContext';
import Select from 'react-select';


const EditProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    email: user?.email || '',
    country: 'United States',
    photo: null,
  });
  console.log('skills:', user.skills);

  const [skillOptions, setSkillOptions] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await codeCrewAPI.getAllSkills();
        const options = response.data.data.skills.map(skill => ({
          value: skill,
          label: skill
        }));
        setSkillOptions(options);

      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };
    fetchSkills();
  }, []);


  const handleSkillsChange = (selectedOptions) => {
    const selectedSkills = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData((prevData) => ({
      ...prevData,
      skills: selectedSkills,
    }));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e, photo) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      [photo]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        skills: formData.skills,
      };


      const response = await codeCrewAPI.updateUser(updatedUser);
      if (response.data.success) {
        alert('Profile updated successfully!');

        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        setUser(response.data.data.user);

        navigate('/my-profile');
      } else {
        alert('Error updating profile');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('Failed to update profile');
    }
  };




  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
        <p className="text-gray-600 mt-2">Fill out your profile to get matched with the right projects and teammates</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
        {/* Personal Information Section */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="janesmith"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>United States</option>
                <option>Canada</option>
                <option>Mexico</option>
              </select>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">About You</h2>

          <div className="mb-6">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about your skills, experience, and what kind of projects you're interested in..."
            />
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Skills
            </label>
            <Select
              isMulti
              options={skillOptions}
              value={skillOptions.filter(option => formData.skills.includes(option.value))}
              onChange={handleSkillsChange}
              classNamePrefix="select"
              placeholder="Select your skills..."
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#d1d5db',
                  '&:hover': {
                    borderColor: '#d1d5db'
                  }
                })
              }}
            />
          </div>
        </div>

        {/* Profile Photo */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Photo</h2>

          <div className="flex items-center gap-4">
            <div className="shrink-0">
              {formData.photo ? (
                <img className="h-16 w-16 rounded-full object-cover" src={URL.createObjectURL(formData.photo)} alt="Current profile" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Photo</span>
                </div>
              )}
            </div>
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                onChange={(e) => handleFileChange(e, 'photo')}
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
