import React from 'react';
import { MessageCircle, Repeat2, Heart, Share, BadgeCheck, Sparkles } from 'lucide-react';
import { MOCK_TWEETS } from '../constants';
import FloatingMenu from './FloatingMenu';

const XTab: React.FC = () => {
  const categories = ['Ciencia', 'Tecnología', 'Geopolítica', 'Cripto', 'Política'];

  const handleCategorySelect = (category: string) => {
    console.log('Selected category:', category);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24 relative">
      <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Para ti</h1>
        {/* Personalization button removed for X tab */}
      </header>

      <div>
        {MOCK_TWEETS.map((tweet) => (
          <article key={tweet.id} className="border-b border-gray-800 p-4 hover:bg-gray-900/20 transition-colors">
            <div className="flex gap-3">
              <img 
                src={tweet.avatarUrl} 
                alt={tweet.authorName} 
                className="w-10 h-10 rounded-full object-cover bg-gray-800"
              />
              <div className="flex-1">
                {/* Header Info */}
                <div className="flex items-center gap-1 mb-1 flex-wrap">
                  <span className="font-bold text-sm sm:text-base text-gray-100">{tweet.authorName}</span>
                  {tweet.isVerified && <BadgeCheck size={16} className="text-blue-400 fill-current" />}
                  <span className="text-gray-500 text-sm">{tweet.authorHandle}</span>
                  <span className="text-gray-500 text-sm">·</span>
                  <span className="text-gray-500 text-sm hover:underline cursor-pointer">{tweet.timestamp}</span>
                </div>
                
                {/* Main Content */}
                <p className="text-gray-200 text-base mb-3 leading-snug">
                  {tweet.content}
                </p>

                {/* AI Analysis Box */}
                <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-3 mb-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-5">
                    <Sparkles size={40} />
                  </div>
                  <h4 className="text-xs font-bold text-blue-400 mb-1 flex items-center gap-1">
                    <Sparkles size={12} /> POR QUÉ ES IMPORTANTE
                  </h4>
                  <p className="text-sm text-blue-100/80 leading-relaxed">
                    {tweet.analysis}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-between text-gray-500 max-w-md pr-4">
                  <button className="flex items-center gap-1 hover:text-blue-400 group transition-colors">
                    <MessageCircle size={18} className="group-hover:bg-blue-500/10 rounded-full p-1.5 box-content -m-1.5 transition-colors" />
                    <span className="text-xs">32</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-green-400 group transition-colors">
                    <Repeat2 size={18} className="group-hover:bg-green-500/10 rounded-full p-1.5 box-content -m-1.5 transition-colors" />
                    <span className="text-xs">{tweet.retweets}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-pink-500 group transition-colors">
                    <Heart size={18} className="group-hover:bg-pink-500/10 rounded-full p-1.5 box-content -m-1.5 transition-colors" />
                    <span className="text-xs">{tweet.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-400 group transition-colors">
                    <Share size={18} className="group-hover:bg-blue-500/10 rounded-full p-1.5 box-content -m-1.5 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <FloatingMenu 
        items={categories}
        onSelect={handleCategorySelect}
      />
    </div>
  );
};

export default XTab;