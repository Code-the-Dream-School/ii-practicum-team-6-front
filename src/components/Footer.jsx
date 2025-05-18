import React from 'react';
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
  const teamMembers = [
    { name: 'Daria', github: 'https://github.com/DariaPavlyuk81' },
    { name: 'Masooma', github: 'https://github.com/JafariM' },
    { name: 'Roman', github: 'https://github.com/brrr123' },
    { name: 'Valery', github: 'https://github.com/sheper96' }
  ];

  return (
      <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
            {teamMembers.map((member) => (
              <a
                key={member.name}
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group"
              >
                  <FaGithub className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors"/>
                  <span className="mt-2 text-sm text-gray-300 group-hover:text-white">
                  {member.name}
                </span>
              </a>
            ))}
          </div>

            <div className="flex items-center space-x-2 mt-8 pt-4 border-t border-slate-700 w-full justify-center">
                <span className="text-gray-300">&copy; {new Date().getFullYear()} CodeCrew.</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
