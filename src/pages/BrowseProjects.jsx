import React, {useState, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import Select from 'react-select';
import ProjectCard from '../components/ProjectCard.jsx';
import {FiRefreshCcw, FiChevronLeft, FiChevronRight} from 'react-icons/fi';
import useProjects from '../hooks/useProjects';
import IsLoading from '../components/IsLoading';
import ShowError from '../components/ShowError.jsx';
import useLoadSkills from '../hooks/useLoadSkills';

const BrowseProjects = () => {
  const DEFAULT_SORT = {value: 'createdAt-desc', label: 'Newest'};

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);

  const projectParams = useMemo(() => ({
    limit: 12,
    page: 1,
    skills: selectedSkills.length > 0 ? selectedSkills.map(skill => skill.value) : undefined,
    sort: sortBy.value,
    search: (searchQuery && searchQuery.length >= 4) ? searchQuery : undefined,
  }), [selectedSkills, sortBy.value, searchQuery && searchQuery.length >= 4 ? searchQuery : null]);

  const {projects, setProjects, isLoading: projectsLoading, error: projectsError} = useProjects(projectParams);
  const {formattedSkillOptions, isLoading: skillsLoading, loadError} = useLoadSkills();

  const navigate = useNavigate();

  const sortOptions = [
    {value: 'createdAt-desc', label: 'Newest'},
    {value: 'mostLiked', label: 'Most Popular'},
  ];

  const handleReset = () => {
    setSearchQuery('');
    setSelectedSkills([]);
    setSortBy(DEFAULT_SORT);
  };


  const handleCardClick = (id) => {
    navigate(`/projects/${id}`);
  };

  const handleSkillClick = (skill) => {
    const isSkillSelected = selectedSkills.some(s => s.value === skill);

    if (!isSkillSelected) {
      setSelectedSkills([...selectedSkills, {value: skill, label: skill}]);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = (searchQuery && searchQuery.length >= 4) || selectedSkills.length > 0 || sortBy.value !== DEFAULT_SORT.value;


  if (projectsError || loadError) {
    return (
        <section className="py-8 px-4">
          <div className="max-w-2xl mx-auto mb-8 space-y-4">
            <h2 className="text-xl font-semibold">Browse Projects</h2>
            <div className="flex justify-center">
              <ShowError error={projectsError || loadError}/>
            </div>
          </div>
        </section>
    );
  }

  return (
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto mb-8 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Browse Projects</h2>
            {hasActiveFilters && (
                <button
                    onClick={handleReset}
                    className=" text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <FiRefreshCcw className="h-4 w-4"/>
                  Reset Filters
                </button>
            )}
          </div>

          <div className="relative">
            <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && searchQuery.length > 0 && searchQuery.length < 4 && (
                <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                  <span className="text-xs text-gray-500">Enter at least 4 characters to search</span>
                </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Skills
              </label>
              <Select
                  isMulti
                  options={formattedSkillOptions}
                  value={selectedSkills}
                  onChange={setSelectedSkills}
                  placeholder={skillsLoading ? "Loading skills..." : "Select skills..."}
                  isDisabled={skillsLoading}
                  isLoading={skillsLoading}
                  className="basic-multi-select"
                  classNamePrefix="select"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort by
              </label>
              <Select
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  className="basic-select"
                  classNamePrefix="select"
              />
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {projectsLoading
                ? "Loading projects..."
                : `Showing ${projects.length} projects`}
          </div>
        </div>

        <div className="flex justify-center">
          {projectsLoading ? (
              <div className="flex justify-center py-8">
                <IsLoading message="Loading projects..."/>
              </div>
          ) : (
              <div className="max-w-7xl overflow-x-auto pb-6 scrollbar-hide">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4">
                  {projects.map((project) => (
                      <div key={project._id}>
                        <ProjectCard
                            project={project}
                            onClick={handleCardClick}
                            onSkillClick={handleSkillClick}
                        />
                      </div>
                  ))}
                </div>
              </div>
          )}
        </div>

        {/*<div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
              <FiChevronLeft className="h-5 w-5"/>
            </button>


            <button className="px-3 py-1 rounded-md bg-blue-500 text-white">
              1
            </button>

            <button className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100">
              2
            </button>

            <button className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
              <FiChevronRight className="h-5 w-5"/>
            </button>
          </div>
        </div>*/}
      </section>
  );
};

export default BrowseProjects;
