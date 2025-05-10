import React, {useState, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import Select from 'react-select';
import ProjectCard from '../components/ProjectCard.jsx';
import {FiRefreshCcw, FiChevronLeft, FiChevronRight} from 'react-icons/fi';
import useProjects from '../hooks/useProjects';
import IsLoading from '../components/IsLoading';
import ShowError from '../components/ShowError.jsx';

const BrowseProjects = () => {
  const DEFAULT_SORT = {value: 'newest'};

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);
  const {projects, setProjects, isLoading, error} = useProjects({
    limit: 8,
    page: 1,

  });

  const navigate = useNavigate();

  const tagOptions = useMemo(() => {
    const allTags = projects.flatMap(project => project.reqSkills || []);
    const uniqueTagsMap = new Map();
    allTags.forEach(tag => {
      if (!uniqueTagsMap.has(tag._id)) {
        uniqueTagsMap.set(tag._id, tag);
      }
    });

    return Array.from(uniqueTagsMap.values()).map(tag => ({
      value: tag._id,
      label: tag.name
    }));
  }, [projects]);

  const sortOptions = [
    {value: 'newest', label: 'Newest'},
    {value: 'popular', label: 'Most Popular'},
  ];

  const handleReset = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortBy(DEFAULT_SORT);
  };

  const filteredAndSortedProjects = useMemo(() => {
    if (!projects.length) return [];

    let filtered = projects;

    if (searchQuery) {
      filtered = filtered.filter(project =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(project =>
          selectedTags.every(tag => project.tags?.includes(tag.value))
      );
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy.value) {
        case 'popular':
          return b.likes - a.likes;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }, [projects, searchQuery, selectedTags, sortBy]);

  const handleLike = (id) => {
    setProjects(projects.map(project =>
        project._id === id ? {
          ...project,
          liked: !project.liked,
          likes: project.liked ? project.likes - 1 : project.likes + 1
        } : project
    ));
  };

  const handleCardClick = (id) => {
    navigate(`/projects/${id}`);
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedTags.length > 0 || sortBy.value !== DEFAULT_SORT.value;

  if (isLoading) {
    return (
        <section className="py-8 px-4">
          <div className="max-w-2xl mx-auto mb-8 space-y-4">
            <h2 className="text-xl font-semibold">Browse Projects</h2>
            <div className="flex justify-center">
              <IsLoading message="Loading projects..."/>
            </div>
          </div>
        </section>
    );
  }

  if (error) {
    return (
        <section className="py-8 px-4">
          <div className="max-w-2xl mx-auto mb-8 space-y-4">
            <h2 className="text-xl font-semibold">Browse Projects</h2>
            <div className="flex justify-center">
              <ShowError error={error}/>
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
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <FiRefreshCcw className="h-4 w-4"/>
                  Reset Filters
                </button>
            )}
          </div>

          <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Tags
              </label>
              <Select
                  isMulti
                  options={tagOptions}
                  value={selectedTags}
                  onChange={setSelectedTags}
                  placeholder="Select tags..."
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
            Showing {filteredAndSortedProjects.length} of {projects.length} projects
          </div>
        </div>

        <div className="flex justify-center">
          <div className="max-w-7xl overflow-x-auto pb-6 scrollbar-hide">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4">
              {filteredAndSortedProjects.map((project) => (
                  <div key={project._id}>
                    <ProjectCard
                        project={project}
                        onLike={handleLike}
                        onClick={handleCardClick}
                    />
                  </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
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
        </div>
      </section>
  );
};

export default BrowseProjects;
