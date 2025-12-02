import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Clock, ChevronRight, Maximize2 } from 'lucide-react';

interface Timestamp {
    time: string;
    seconds: number;
    emoji: string;
    title: string;
    points: string[];
    thumbnail?: string;
}

interface VideoPlayerProps {
    videoId: string;
    title: string;
    timestamps: Timestamp[];
    transcription?: string;
}

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, title, timestamps, transcription }) => {
    const playerRef = useRef<any>(null);
    const [player, setPlayer] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTimestamp, setActiveTimestamp] = useState<number | null>(null);

    useEffect(() => {
        if (window.YT) {
            initPlayer();
            return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = initPlayer;

        return () => {
            if (player) {
                player.destroy();
            }
        };
    }, [videoId]);

    const initPlayer = () => {
        if (!window.YT || !playerRef.current) return;

        const newPlayer = new window.YT.Player(playerRef.current, {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                enablejsapi: 1,
                origin: window.location.origin,
                modestbranding: 1,
                rel: 0,
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
            },
        });

        setPlayer(newPlayer);
    };

    const onPlayerReady = (event: any) => {
        const interval = setInterval(() => {
            if (event.target && typeof event.target.getCurrentTime === 'function') {
                const time = event.target.getCurrentTime();
                setCurrentTime(time);

                const active = timestamps.findIndex((ts, idx) => {
                    const nextTs = timestamps[idx + 1];
                    return time >= ts.seconds && (!nextTs || time < nextTs.seconds);
                });
                setActiveTimestamp(active);
            }
        }, 1000);

        return () => clearInterval(interval);
    };

    const onPlayerStateChange = (event: any) => {
        setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
    };

    const jumpToTimestamp = (seconds: number) => {
        if (player && player.seekTo) {
            player.seekTo(seconds, true);
            player.playVideo();
        }
    };

    const togglePlayPause = () => {
        if (!player) return;
        if (isPlaying) player.pauseVideo();
        else player.playVideo();
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-black text-white overflow-hidden">

            {/* COLUMNA IZQUIERDA: Video Player */}
            <div className="relative w-full lg:w-3/4 h-[40vh] lg:h-full flex flex-col bg-black">
                <div className="relative flex-1 bg-black">
                    <div ref={playerRef} className="absolute inset-0 w-full h-full" />
                </div>

                {/* Controles Overlay (Solo móvil o cuando no hay controles nativos) */}
                <div className="hidden lg:flex items-center justify-between p-4 bg-gray-900 border-t border-gray-800">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={togglePlayPause}
                            className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                        </button>
                        <div>
                            <h2 className="text-lg font-bold line-clamp-1">{title}</h2>
                            <div className="text-sm text-gray-400 flex items-center gap-2">
                                <Clock size={14} />
                                {formatTime(currentTime)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* COLUMNA DERECHA: Resumen Interactivo */}
            <div className="w-full lg:w-1/4 h-full flex flex-col bg-gray-950 border-l border-gray-800">

                {/* Header del Resumen */}
                <div className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        📝 Resumen Interactivo
                    </h3>
                </div>

                {/* Lista de Timestamps Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
                    {timestamps.map((ts, index) => (
                        <button
                            key={index}
                            onClick={() => jumpToTimestamp(ts.seconds)}
                            className={`w-full text-left p-4 rounded-xl transition-all border ${activeTimestamp === index
                                    ? 'bg-blue-900/20 border-blue-500/50 shadow-lg shadow-blue-900/20'
                                    : 'bg-gray-900/50 border-gray-800 hover:bg-gray-800 hover:border-gray-700'
                                }`}
                        >
                            {/* Header Timestamp */}
                            <div className="flex items-center justify-between mb-2">
                                <div className={`flex items-center gap-2 text-xs font-mono px-2 py-1 rounded-md ${activeTimestamp === index ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'
                                    }`}>
                                    <Clock size={12} />
                                    {ts.time}
                                </div>
                                {activeTimestamp === index && (
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <div className="flex items-start gap-3 mb-2">
                                <span className="text-xl mt-0.5">{ts.emoji}</span>
                                <h4 className={`font-bold text-sm leading-tight ${activeTimestamp === index ? 'text-white' : 'text-gray-300'
                                    }`}>{ts.title}</h4>
                            </div>

                            {/* Points */}
                            <ul className="space-y-1.5 pl-1">
                                {ts.points.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-gray-400">
                                        <span className="text-blue-500 mt-1">•</span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </button>
                    ))}

                    {/* Transcripción */}
                    {transcription && (
                        <div className="pt-4 mt-4 border-t border-gray-800">
                            <details className="group">
                                <summary className="cursor-pointer text-xs font-bold text-gray-500 uppercase tracking-wide hover:text-white transition-colors flex items-center justify-between p-2 rounded hover:bg-gray-900">
                                    <span>📄 Ver Transcripción</span>
                                    <ChevronRight size={16} className="group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="mt-2 p-3 bg-black/50 rounded-lg text-xs text-gray-400 leading-relaxed whitespace-pre-wrap font-mono border border-gray-800">
                                    {transcription}
                                </div>
                            </details>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
