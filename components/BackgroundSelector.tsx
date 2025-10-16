
import React from 'react';
import { BACKGROUNDS } from '../constants';

interface BackgroundSelectorProps {
  onSelect: (url: string) => void;
  currentBg: string;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ onSelect, currentBg }) => {
  return (
    <div className="bg-white/50 backdrop-blur-md rounded-xl p-3 max-w-md mx-auto">
      <div className="flex justify-center items-center space-x-3 space-x-reverse">
        {BACKGROUNDS.map((bg) => (
          <button
            key={bg.id}
            onClick={() => onSelect(bg.url)}
            className={`w-16 h-10 rounded-lg bg-cover bg-center transition-all duration-300 transform hover:scale-110 ${
              currentBg === bg.url ? 'ring-4 ring-yellow-300 ring-offset-2 ring-offset-transparent' : ''
            }`}
            style={{ backgroundImage: `url(${bg.url})` }}
            aria-label={`Select ${bg.name} background`}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundSelector;
