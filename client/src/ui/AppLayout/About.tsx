// pages/about.tsx

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Ahmed Rabea',
      email: 'Ahmedrabea1349@gmail.com',
      link: 'https://www.linkedin.com/in/ahmed-rabea254/'
    },
    {
      name: 'Ahmed Ehab Abdelaziz Mohamed',
      email: 'ahmede3956@gmail.com',
      link: 'https://www.linkedin.com/in/ahmed-ehab-abdelaziz/'
    },
    {
      name: 'Ahmed Hosny Abdelsameea',
      email: 'ahmedhosnikassab417@gmail.com',
      link: 'https://www.linkedin.com/in/ahmed-hosny-41ba86234/'
    },
    {
      name: 'AbdEL-Rahman Khaled Tamim Abass',
      email: 'abdokhaled810@gmail.com',
      link: 'https://www.linkedin.com/in/abdel-rahman-khaled-b4b29823a'
    },
    {
      name: 'Ahmed Hytham AL-Biblawy',
      email: 'Ahmedhytham48@gmail.com',
      link: 'https://linktr.ee/AhmedHythamSMT'
    },
    {
      name: 'Ahmed Samir Said Sopih',
      email: 'ahmedsm504@gmail.com',
      link: 'https://www.linkedin.com/in/ahmed-samir--said1'
    },
    {
      name: 'Hassan Omar Hassan',
      email: 'hasanomarwork@gmail.com',
      link: 'http://linkedin.com/in/hasanomarhasan/'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            The HealGen Team
          </h1>
          <p className="text-xl text-gray-600">
            Meet the talented team behind the scenes who made this project a reality
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                
                <div className="mt-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <a 
                      href={`mailto:${member.email}`} 
                      className="hover:text-blue-600 transition-colors duration-300"
                    >
                      {member.email}
                    </a>
                  </div>

                  {member.link && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                      </svg>
                      <a 
                        href={member.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 transition-colors duration-300 truncate"
                      >
                        {member.link.includes('linkedin') ? 'LinkedIn' : 
                         member.link.includes('linktr') ? 'Linktree' : 
                         'Profile'}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;