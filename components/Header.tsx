
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 text-white">
      <h1 className="text-4xl md:text-5xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
        أدعية من القلب 🌿
      </h1>
      <p className="text-lg md:text-xl mt-2 font-light" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
        اغرس دعوة في قلب من تحب، فتنمو زهورًا في حياته
      </p>
    </header>
  );
};

export default Header;
