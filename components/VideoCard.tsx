import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Clock, ChevronRight, Maximize2, List, Sparkles } from 'lucide-react';

interface Timestamp {
    time: string;
    seconds: number;
    emoji: string;
    title: string;
    points: string[];
    thumbnail?: string;
}

export interface VideoData {
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

const VideoCard: React.FC<VideoData> = ({ videoId, title, timestamps, transcription }) => {
    const playerRef = useRef<any>(null);
    const [player, setPlayer] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [activeTimestamp, setActiveTimestamp] = useState<number | null>(null);
    const containerId = `youtube-player-${videoId}`;

    useEffect(() => {
        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            if (!window.onYouTubeIframeAPIReady) {
                window.onYouTubeIframeAPIReady = () => {
                    window.dispatchEvent(new Event('YTReady'));
                };
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            }

            const handleYTReady = () => initPlayer();
            window.addEventListener('YTReady', handleYTReady);
            return () => window.removeEventListener('YTReady', handleYTReady);
        }

        return () => {
            if (player) {
                player.destroy();
            }
        };
    }, [videoId]);

    const initPlayer = () => {
        if (!document.getElementById(containerId)) return;

        try {
            const newPlayer = new window.YT.Player(containerId, {
                height: '100%',
                width: '100%',
                videoId: videoId,
                playerVars: {
                    enablejsapi: 1,
                    origin: window.location.origin,
                    modestbranding: 1,
                    rel: 0,
                    controls: 1,
                    showinfo: 0,
                },
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange,
                },
            });
            setPlayer(newPlayer);
        } catch (e) {
            console.error("Error initializing player", e);
        }
    };

    const onPlayerReady = (event: any) => {
        const interval = setInterval(() => {
            if (event.target && typeof event.target.getCurrentTime === 'function') {
                try {
                    const time = event.target.getCurrentTime();
                    setCurrentTime(time);

                    const active = timestamps.findIndex((ts, idx) => {
                        const nextTs = timestamps[idx + 1];
                        return time >= ts.seconds && (!nextTs || time < nextTs.seconds);
                    });
                    setActiveTimestamp(active);
                } catch (e) {
                    clearInterval(interval);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    };

    const onPlayerStateChange = (event: any) => {
        const playing = event.data === window.YT.PlayerState.PLAYING;
        setIsPlaying(playing);
        if (playing) {
            setHasStarted(true);
        }
    };

    const jumpToTimestamp = (seconds: number) => {
        if (player && player.seekTo) {
            player.seekTo(seconds, true);
            player.playVideo();
            setHasStarted(true);
        }
    };

    const startVideo = () => {
        if (player && player.playVideo) {
            player.playVideo();
            setHasStarted(true);
        }
    };

    return (
        <div className="flex flex-col bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl mb-16">

            {/* HEADER TÍTULO - Fondo sólido para asegurar legibilidad */}
            <div className="px-6 py-5 border-b border-gray-800 bg-gray-900">
                <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
                    {title}
                </h2>
            </div>

            <div className="flex flex-col xl:flex-row">
                {/* SECCIÓN VIDEO */}
                <div className="w-full xl:w-2/3 bg-black relative aspect-video xl:aspect-auto xl:min-h-[500px] group/video">
                    <div id={containerId} className="w-full h-full absolute inset-0" />

                    {/* CUSTOM PLAY OVERLAY */}
                    {!hasStarted && (
                        <div
                            className="absolute inset-0 z-20 cursor-pointer group/overlay"
                            onClick={startVideo}
                        >
                            <img
                                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                alt="Video Thumbnail"
                                className="w-full h-full object-cover opacity-60 group-hover/overlay:opacity-40 transition-opacity duration-300"
                            />
                            <div className="absolute inset-0 bg-black/50" />

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center group-hover/overlay:scale-110 transition-transform duration-300">
                                    <Play size={32} className="text-white ml-1 fill-white" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* SECCIÓN RESUMEN */}
                <div className="w-full xl:w-1/3 flex flex-col bg-gray-950 border-t xl:border-t-0 xl:border-l border-gray-800 h-[500px] xl:h-auto xl:max-h-[600px]">

                    {/* Header Resumen */}
                    <div className="px-5 py-4 border-b border-gray-800 bg-gray-900 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-400">
                            <Sparkles size={16} />
                            <h3 className="text-xs font-bold uppercase tracking-wider">Resumen IA</h3>
                        </div>
                        <span className="text-xs font-mono text-gray-400 bg-gray-800 px-2 py-1 rounded">
                            {timestamps.length} SECCIONES
                        </span>
                    </div>

                    {/* Lista Scrollable */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                        {timestamps.map((ts, index) => (
                            <button
                                key={index}
                                onClick={() => jumpToTimestamp(ts.seconds)}
                                className={`w-full text-left p-4 rounded-xl transition-all duration-200 border ${activeTimestamp === index
                                        ? 'bg-blue-900/20 border-blue-500/50'
                                        : 'bg-transparent border-transparent hover:bg-gray-900 hover:border-gray-800'
                                    }`}
                            >
                                <div className="flex gap-3">
                                    {/* Tiempo */}
                                    <div className="flex flex-col items-center pt-1 min-w-[45px]">
                                        <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${activeTimestamp === index ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                                            }`}>
                                            {ts.time}
                                        </span>
                                        {index !== timestamps.length - 1 && (
                                            <div className="w-px h-full bg-gray-800 my-2" />
                                        )}
                                    </div>

                                    {/* Contenido */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-2 mb-2">
                                            <span className="text-lg leading-none">{ts.emoji}</span>
                                            <h4 className={`text-sm font-bold leading-snug ${activeTimestamp === index ? 'text-white' : 'text-gray-300'
                                                }`}>
                                                {ts.title}
                                            </h4>
                                        </div>

                                        <ul className="space-y-1.5 pl-1">
                                            {ts.points.map((point, i) => (
                                                <li key={i} className="text-xs leading-relaxed text-gray-400 pl-2 border-l-2 border-gray-800">
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </button>
                        ))}

                        {/* Transcripción Footer */}
                        {transcription && (
                            <div className="mt-4 px-2 pb-4">
                                <details className="group/transcription">
                                    <summary className="cursor-pointer text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-white transition-colors flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-gray-800 hover:border-gray-700">
                                        <span>Ver Transcripción</span>
                                        <ChevronRight size={14} className="group-open/transcription:rotate-90 transition-transform" />
                                    </summary>
                                    <div className="mt-2 p-4 bg-black rounded-xl text-xs text-gray-400 leading-relaxed font-mono border border-gray-800 max-h-60 overflow-y-auto">
                                        {transcription}
                                    </div>
                                </details>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
