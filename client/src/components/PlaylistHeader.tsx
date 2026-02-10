import { Playlist } from "@shared/schema";
import { Clock } from "lucide-react";

interface PlaylistHeaderProps {
  playlist: Playlist;
  songCount: number;
  totalDuration?: string;
}

export function PlaylistHeader({ playlist, songCount, totalDuration = "3 hr 15 min" }: PlaylistHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-end pb-6 pt-10 px-6 md:px-8 relative z-10">
      {/* Cover Art with Shadow */}
      <div className="shrink-0 shadow-[0_4px_60px_rgba(0,0,0,0.5)]">
        <img
          src={playlist.coverUrl}
          alt={playlist.name}
          className="w-52 h-52 md:w-60 md:h-60 object-cover shadow-2xl rounded-md"
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-2 md:gap-4 w-full">
        <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-white/90 hidden md:block">
          Playlist
        </span>
        
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter text-shadow-lg leading-none py-2">
          {playlist.name}
        </h1>

        <div className="mt-2 text-sm md:text-base text-white/70 font-medium">
          {playlist.description}
        </div>

        <div className="flex items-center gap-1 text-sm font-semibold text-white mt-2">
          {/* Avatar simulation or just text */}
          <div className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center text-[10px] overflow-hidden">
             {/* Use first letter of author */}
             {playlist.author[0]}
          </div>
          <span className="hover:underline cursor-pointer">{playlist.author}</span>
          <span className="text-white/60 mx-1">•</span>
          <span className="text-white/60">{playlist.likes.toLocaleString()} likes</span>
          <span className="text-white/60 mx-1">•</span>
          <span className="text-white/60">{songCount} songs,</span>
          <span className="text-white/60 ml-1 font-normal opacity-80">{totalDuration}</span>
        </div>
      </div>
    </div>
  );
}
