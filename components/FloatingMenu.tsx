import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface FloatingMenuProps {
  items: string[];
  onSelect: (item: string) => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ items, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2">
      {/* Expanded Menu Items */}
      {isOpen && (
        <div className="flex flex-col gap-2 items-end mb-2 transition-all duration-300 ease-out origin-bottom">
          {items.map((item, index) => (
            <button
              key={item}
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
              }}
              className="bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded-full shadow-lg border border-gray-700 hover:bg-gray-700 transition-transform hover:scale-105 animate-in slide-in-from-bottom-2 fade-in duration-200"
              style={{ animationDelay: `${(items.length - 1 - index) * 50}ms` }}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-gray-700 rotate-45' : 'bg-blue-600 hover:bg-blue-500 hover:scale-110'
        }`}
      >
        <Plus size={28} color="white" />
      </button>
    </div>
  );
};

export default FloatingMenu;