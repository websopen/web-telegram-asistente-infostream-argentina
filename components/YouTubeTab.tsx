import React, { useState, useEffect } from 'react';
import VideoCard, { VideoData } from './VideoCard';
import { RefreshCw } from 'lucide-react';

const EXAMPLE_VIDEOS: VideoData[] = [
  {
    videoId: 'zBt_0Dx_7Zs',
    title: '¿Por qué el fútbol argentino está en crisis? | Análisis Económico',
    timestamps: [
      {
        time: '00:00',
        seconds: 0,
        emoji: '🏆',
        title: 'Introducción al Problema',
        points: [
          'El fútbol argentino está en un mal momento histórico',
          'Sequía de títulos internacionales desde 2019',
          'El video se centrará en el factor económico, no en la AFA'
        ]
      },
      {
        time: '02:18',
        seconds: 138,
        emoji: '💰',
        title: 'El Factor Económico Clave',
        points: [
          'La competencia entre clubes es principalmente por salarios',
          'Un dólar caro en Argentina perjudica los salarios en dólares',
          'Los clubes brasileños pueden pagar mejores sueldos'
        ]
      },
      {
        time: '07:45',
        seconds: 465,
        emoji: '📊',
        title: 'Análisis Histórico',
        points: [
          'Mejores épocas del fútbol argentino: años 60 y 70',
          'Correlación con economía nacional que funcionaba',
          'Falta de crecimiento económico = destrucción del patrimonio futbolístico'
        ]
      },
      {
        time: '11:40',
        seconds: 700,
        emoji: '🎯',
        title: 'Conclusión',
        points: [
          'Problema más grande que la AFA',
          'Se debe criticar gestión de clubes y política',
          'Con 20 años de dólar caro es difícil competir'
        ]
      }
    ],
    transcription: `Speaker_0.0: El nuevo campeón de la Copa Libertadores, así como viene pasando desde 2019, es un club brasileño...`
  },
  {
    videoId: 'dQw4w9WgXcQ',
    title: 'Ejemplo de Segundo Video en el Feed',
    timestamps: [
      {
        time: '00:00',
        seconds: 0,
        emoji: '🎵',
        title: 'Inicio Musical',
        points: [
          'Introducción icónica de batería',
          'Baile característico de Rick Astley'
        ]
      },
      {
        time: '00:43',
        seconds: 43,
        emoji: '🎤',
        title: 'Estribillo Legendario',
        points: [
          'Never gonna give you up',
          'Never gonna let you down',
          'Promesas de fidelidad eterna'
        ]
      }
    ],
    transcription: `We're no strangers to love... You know the rules and so do I...`
  }
];

const YouTubeTab: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setVideos(EXAMPLE_VIDEOS);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-black pb-32 pt-8">
      {/* Botón de Refresh Flotante (Discreto) */}
      <div className="fixed bottom-24 right-6 z-50 lg:hidden">
        <button
          onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000); }}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-all active:scale-95"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Feed Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {loading ? (
          // Skeleton Loading Premium
          [1, 2].map((i) => (
            <div key={i} className="flex flex-col bg-[#0A0A0A] border border-gray-800 rounded-2xl overflow-hidden animate-pulse mb-12">
              <div className="h-16 bg-gray-900 border-b border-gray-800" />
              <div className="flex flex-col xl:flex-row h-[500px]">
                <div className="w-full xl:w-[65%] bg-gray-900" />
                <div className="w-full xl:w-[35%] border-l border-gray-800 p-6 space-y-6 bg-[#0f0f0f]">
                  <div className="space-y-4">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="flex gap-4">
                        <div className="w-10 h-10 bg-gray-800 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-800 rounded w-3/4" />
                          <div className="h-3 bg-gray-800 rounded w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          videos.map((video) => (
            <VideoCard key={video.videoId} {...video} />
          ))
        )}

        {!loading && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-700 gap-3">
            <div className="w-1 h-1 bg-gray-800 rounded-full" />
            <div className="w-1 h-1 bg-gray-800 rounded-full" />
            <div className="w-1 h-1 bg-gray-800 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeTab;