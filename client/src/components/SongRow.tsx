import { Song } from "@shared/schema";
import { Play, Heart, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SongRowProps {
  song: Song;
  index: number;
}

export function SongRow({ song, index }: SongRowProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group grid grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-4 items-center px-4 py-2 rounded-md hover:bg-white/10 transition-colors duration-200 cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Index Column */}
      <div className="text-right text-muted-foreground font-medium text-base w-4 flex justify-end">
        {isHovered ? (
          <Play fill="currentColor" className="w-4 h-4 text-white" />
        ) : (
          <span className="group-hover:hidden">{index + 1}</span>
        )}
      </div>

      {/* Title & Artist Column */}
      <div className="flex items-center gap-4 overflow-hidden">
        <img 
          src={song.coverUrl} 
          alt={song.album} 
          className="w-10 h-10 rounded-sm object-cover shadow-sm shrink-0" 
        />
        <div className="flex flex-col overflow-hidden">
          <span className={cn(
            "text-base font-medium truncate text-white",
            isHovered && "text-primary" // Highlight title on hover like Spotify
          )}>
            {song.title}
          </span>
          <span className="text-sm text-muted-foreground group-hover:text-white transition-colors truncate">
            {song.artist}
          </span>
        </div>
      </div>

      {/* Album Column */}
      <div className="text-sm text-muted-foreground group-hover:text-white transition-colors truncate">
        {song.album}
      </div>

      {/* Duration & Actions Column */}
      <div className="flex items-center justify-between pl-2">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="w-4 h-4 text-muted-foreground hover:text-white hover:scale-105 transition-transform cursor-pointer" />
        </div>
        
        <span className="text-sm text-muted-foreground font-variant-numeric tabular-nums">
          {song.duration}
        </span>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
           <MoreHorizontal className="w-4 h-4 text-muted-foreground hover:text-white cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
