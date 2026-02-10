import { usePlaylist, usePlaylistSongs } from "@/hooks/use-music";
import { PlaylistHeader } from "@/components/PlaylistHeader";
import { SongRow } from "@/components/SongRow";
import { PlayButton } from "@/components/PlayButton";
import { Clock, Loader2, MoreHorizontal, Heart, ArrowDownCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";

// Helper to extract dominant color simulation
// In a real app this would analyze the image
const GRADIENT_COLORS = {
  from: "from-[#5e3a3a]", // Dark moody red/brown
  to: "to-[#121212]",
};

export default function PlaylistPage() {
  const playlistId = 1; // Single playlist app
  const { data: playlist, isLoading: isLoadingPlaylist } = usePlaylist(playlistId);
  const { data: songs, isLoading: isLoadingSongs } = usePlaylistSongs(playlistId);
  const [scrolled, setScrolled] = useState(false);

  // Scroll handler for navbar background opacity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="min-h-screen bg-[#121212] text-white font-sans relative overflow-x-hidden selection:bg-primary/30 selection:text-white">
      
      {/* Background Gradient Mesh */}
      <div className={`absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b ${GRADIENT_COLORS.from} to-[#121212] opacity-80 pointer-events-none`} />

      {/* Main Content Area */}
      <div className="relative w-full max-w-full pb-20">
        
        {/* Top Navigation (Simulated) */}
        <header className={`sticky top-0 z-50 h-16 flex items-center justify-between px-8 transition-all duration-300 ${scrolled ? 'bg-[#121212]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
           <div className="flex gap-4">
              {/* Back/Forward buttons simulated */}
              <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center cursor-not-allowed">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="white" className="opacity-60"><path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z"></path></svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center cursor-not-allowed">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="white" className="opacity-60"><path d="M4.97.47a.75.75 0 0 0 0 1.06L11.44 8l-6.47 6.47a.75.75 0 1 0 1.06 1.06L13.56 8 6.03.47a.75.75 0 0 0-1.06 0z"></path></svg>
              </div>
              
              {/* Title fades in on scroll */}
              <span className={`text-xl font-bold ml-4 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
                {playlist.name}
              </span>
           </div>

           <div className="flex items-center gap-4">
             <button className="text-sm font-bold text-muted-foreground hover:text-white hover:scale-105 transition-all">Sign up</button>
             <button className="bg-white text-black text-sm font-bold px-8 py-3 rounded-full hover:scale-105 transition-all">Log in</button>
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
            <PlayButton onClick={() => console.log('Playing')} />
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
              />
            ))}
            
            {/* Empty State / Bottom Padding */}
            {songs?.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                No songs in this playlist yet.
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-white/10 text-xs text-muted-foreground flex flex-col gap-1">
               <p>© 2024 {playlist.author} Records</p>
               <p>℗ 2024 {playlist.author} Records</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
