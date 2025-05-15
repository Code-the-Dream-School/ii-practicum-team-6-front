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
    <div className="max-w-4xl mx-auto px-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold text-gray-900">Profile</h2>
            <p className="mt-1 text-sm text-gray-600">Complete your profile to get matched with the right projects.</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-900">Username</label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm"></div>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      className="block w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                      placeholder="janesmith"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>



              {/* Email and Country Fields */}
              <div className="sm:col-span-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email address</label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="country" className="block text-sm font-medium text-gray-900">Country</label>
                <div className="mt-2">
                  <select
                    id="country"
                    name="country"
                    className="w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="col-span-full">
            <label htmlFor="about" className="block text-sm font-medium text-gray-900">About</label>
            <div className="mt-2">
              <textarea
                name="bio"
                id="bio"
                rows="3"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                value={formData.bio}
                onChange={handleChange}
                placeholder='Write a few sentences about yourself' // make it more engaging
              />
            </div>

          </div>


          {/* Skills*/}
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-900">Skills</label>
            <Select
              isMulti
              options={skillOptions}
              value={skillOptions.filter(option => formData.skills.includes(option.value))}
              onChange={handleSkillsChange}
              className="mt-1"
              placeholder="Select your skills..."
            />
          </div>

          {/* Profile Photo */}
          <div className="col-span-full">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-900">Profile Photo</label>
            <div className="mt-2 flex items-center gap-x-3">
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'photo')}
              />
              {formData.photo && <span>{formData.photo.name}</span>}
            </div>
          </div>
        </div>



        <div className="mt-10 flex items-center justify-end gap-x-6">
          <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
