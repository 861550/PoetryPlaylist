import { usePlaylist, usePlaylistSongs } from "@/hooks/use-music";
import { PlaylistHeader } from "@/components/PlaylistHeader";
import { SongRow } from "@/components/SongRow";
import { Clock, Loader2, MoreHorizontal, Heart, ArrowDownCircle, Play, Pause, Square, SkipForward, X } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Song } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Helper to extract dominant color simulation
const GRADIENT_COLORS = {
  from: "from-purple-900", // Soft purple
  to: "to-[#121212]",
};

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function parseDuration(duration: string) {
  const [mins, secs] = duration.split(':').map(Number);
  return (mins * 60) + secs;
}

export default function PlaylistPage() {
  const playlistId = 1; // Single playlist app
  const { data: playlist, isLoading: isLoadingPlaylist } = usePlaylist(playlistId);
  const { data: songs, isLoading: isLoadingSongs } = usePlaylistSongs(playlistId);
  const [scrolled, setScrolled] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showExplore, setShowExplore] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const durationSeconds = useMemo(() => {
    if (!currentSong) return 0;
    return parseDuration(currentSong.duration);
  }, [currentSong]);

  // Scroll handler for navbar background opacity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Audio timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentSong) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= durationSeconds) {
            handleNext();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong, durationSeconds]);

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentTime(0);
    // In a real app with audio files, we'd do:
    // if (audioRef.current) {
    //   audioRef.current.src = `/audio/${song.id}.mp3`;
    //   audioRef.current.play();
    // }
  };

  const handleNext = () => {
    if (!songs || !currentSong) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    if (currentIndex < songs.length - 1) {
      handlePlaySong(songs[currentIndex + 1]);
    } else {
      stopPlayback();
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentSong(null);
  };

  if (isLoadingPlaylist || isLoadingSongs) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#121212] text-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#121212] text-white gap-4">
        <h1 className="text-2xl font-bold">Playlist Not Found</h1>
        <p className="text-muted-foreground">The requested playlist could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans relative overflow-x-hidden selection:bg-purple-500/30 selection:text-white pb-32">
      
      {/* Background Gradient Mesh */}
      <div className={`absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b ${GRADIENT_COLORS.from} to-[#121212] opacity-80 pointer-events-none transition-colors duration-1000`} />

      {/* Main Content Area */}
      <div className="relative w-full max-w-full pb-20">
        
        {/* Top Navigation */}
        <header className={`sticky top-0 z-50 h-16 flex items-center justify-between px-8 transition-all duration-300 ${scrolled ? 'bg-[#121212]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
           <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center cursor-not-allowed">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="white" className="opacity-60"><path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z"></path></svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center cursor-not-allowed">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="white" className="opacity-60"><path d="M4.97.47a.75.75 0 0 0 0 1.06L11.44 8l-6.47 6.47a.75.75 0 1 0 1.06 1.06L13.56 8 6.03.47a.75.75 0 0 0-1.06 0z"></path></svg>
              </div>
              
              <span className={`text-xl font-bold ml-4 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
                {playlist.name}
              </span>
           </div>
        </header>

        {/* Playlist Header Section */}
        <PlaylistHeader 
          playlist={playlist} 
          songCount={songs?.length || 0} 
        />

        {/* Action Bar Gradient Overlay */}
        <div className="absolute top-[380px] md:top-[420px] left-0 right-0 h-60 bg-gradient-to-b from-black/20 to-[#121212] z-0 pointer-events-none" />

        {/* Content Body */}
        <div className="relative z-10 bg-[#121212]/30 backdrop-blur-3xl min-h-[500px] px-6 md:px-8">
          
          {/* Action Buttons Row */}
          <div className="flex items-center gap-8 py-6">
            <button 
              onClick={() => songs?.[0] && handlePlaySong(songs[0])}
              className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center hover:scale-105 transition-all shadow-xl hover:bg-purple-500 active:scale-95 group"
            >
              <Play fill="black" className="w-6 h-6 text-black ml-1" />
            </button>
            <Heart className="w-8 h-8 text-muted-foreground hover:text-white transition-colors cursor-pointer" />
            <ArrowDownCircle className="w-8 h-8 text-muted-foreground hover:text-white transition-colors cursor-pointer" />
            <MoreHorizontal className="w-8 h-8 text-muted-foreground hover:text-white transition-colors cursor-pointer ml-auto md:ml-0" />
            
            <div className="ml-auto flex items-center gap-2 text-muted-foreground hover:text-white cursor-pointer group">
              <span className="text-sm font-semibold">List</span>
              <div className="w-4 h-4 grid grid-cols-2 gap-[2px]">
                <div className="bg-current rounded-[1px]" />
                <div className="bg-current rounded-[1px] opacity-50 group-hover:opacity-100" />
                <div className="bg-current rounded-[1px] opacity-50 group-hover:opacity-100" />
                <div className="bg-current rounded-[1px] opacity-50 group-hover:opacity-100" />
              </div>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-4 px-4 py-2 border-b border-white/10 text-muted-foreground text-sm font-medium mb-4 sticky top-16 bg-[#121212] z-20 group">
            <div className="text-right">#</div>
            <div>Title</div>
            <div>Album</div>
            <div className="flex justify-end pr-8"><Clock className="w-4 h-4" /></div>
          </div>

          {/* Song List */}
          <div className="flex flex-col pb-12">
            {songs?.map((song, index) => (
              <SongRow 
                key={song.id} 
                song={song} 
                index={index} 
                onPlay={() => handlePlaySong(song)}
                isPlaying={currentSong?.id === song.id && isPlaying}
              />
            ))}
            
            <div className="mt-8 pt-8 border-t border-white/10 text-xs text-muted-foreground flex flex-col gap-1">
               <p>© Krish 78FI English Poetry Playlist</p>
            </div>
          </div>
        </div>
      </div>

      {/* Player Bar */}
      {currentSong && (
        <div className="fixed bottom-6 left-6 right-6 h-24 bg-black/90 backdrop-blur-xl border border-white/10 px-8 flex items-center z-[100] rounded-full shadow-2xl">
          {/* Left side: Song info */}
          <div className="flex items-center gap-4 w-[30%] min-w-0">
            <img 
              src={currentSong.coverUrl} 
              alt={currentSong.album} 
              className="w-14 h-14 rounded-md object-cover shadow-lg"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate hover:underline cursor-pointer">
                {currentSong.title}
              </span>
              <span className="text-xs text-muted-foreground truncate hover:underline cursor-pointer hover:text-white">
                {currentSong.artist}
              </span>
            </div>
          </div>

          {/* Middle: Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-[40%]">
            <div className="flex items-center gap-6">
              <button 
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="w-5 h-5 text-black fill-black" /> : <Play className="w-5 h-5 text-black fill-black ml-1" />}
              </button>
              <button 
                onClick={stopPlayback}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Square className="w-4 h-4 text-white fill-white" />
              </button>
              <button onClick={handleNext}>
                <SkipForward className="w-5 h-5 text-muted-foreground hover:text-white cursor-pointer" />
              </button>
            </div>
            <div className="w-full flex items-center gap-3 group">
              <span className="text-[11px] text-muted-foreground tabular-nums min-w-[35px] text-right">{formatTime(currentTime)}</span>
              <Slider 
                value={[currentTime]} 
                max={durationSeconds} 
                step={1} 
                onValueChange={([val]) => setCurrentTime(val)}
                className="flex-1 cursor-pointer [&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-500 [&_.bg-primary]:bg-purple-500"
              />
              <span className="text-[11px] text-muted-foreground tabular-nums min-w-[35px]">{currentSong.duration}</span>
            </div>
          </div>

          {/* Right side: Extra actions */}
          <div className="flex items-center justify-end gap-4 w-[30%]">
            <MoreHorizontal 
              onClick={() => setShowExplore(true)}
              className="w-6 h-6 text-muted-foreground hover:text-white cursor-pointer transition-colors" 
            />
          </div>
        </div>
      )}

      {/* Explore Dialog for Current Song */}
      {currentSong && (
        <Dialog open={showExplore} onOpenChange={setShowExplore}>
          <DialogContent className="bg-[#181818] border-none text-white max-w-md overflow-hidden p-0 rounded-2xl shadow-2xl">
            <div className="relative h-56 w-full">
              {/* Blurred background */}
              <div 
                className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-50 scale-125"
                style={{ backgroundImage: `url(${currentSong.coverUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#181818]" />
              
              <div className="absolute top-4 right-4 z-50">
                <button 
                  onClick={() => setShowExplore(false)}
                  className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="relative z-10 p-6 flex flex-col items-center justify-center h-full pt-12">
                <img 
                  src={currentSong.coverUrl} 
                  alt={currentSong.album} 
                  className="w-36 h-36 rounded-md shadow-2xl object-cover mb-4 ring-1 ring-white/10" 
                />
                <div className="text-center">
                  <DialogTitle className="text-2xl font-bold tracking-tight">{currentSong.title}</DialogTitle>
                  <p className="text-purple-400 font-semibold">{currentSong.artist}</p>
                </div>
              </div>
            </div>
            
            <div className="px-8 pb-10 pt-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Song Meaning</h3>
              <ScrollArea className="h-[280px] rounded-xl bg-black/30 p-6 ring-1 ring-white/5">
                <p className="text-base leading-relaxed text-white/90 font-medium">
                  {currentSong.meaning}
                </p>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}