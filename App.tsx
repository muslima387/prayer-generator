
import React, { useState } from 'react';
import { BACKGROUNDS } from './constants';
import PrayerCard from './components/PrayerCard';
import BackgroundSelector from './components/BackgroundSelector';
import Header from './components/Header';

const App: React.FC = () => {
  const [selectedBg, setSelectedBg] = useState<string>(BACKGROUNDS[0].url);

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center transition-all duration-1000 flex flex-col items-center justify-center p-4 text-gray-800"
      style={{ backgroundImage: `url(${selectedBg})` }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto">
        <Header />
        <PrayerCard selectedBg={selectedBg} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
        <BackgroundSelector onSelect={setSelectedBg} currentBg={selectedBg} />
      </div>
    </div>
  );
};

export default App;
