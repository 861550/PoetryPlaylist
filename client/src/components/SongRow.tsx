import { Song } from "@shared/schema";
import { Play, Heart, MoreHorizontal, Pause } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SongRowProps {
  song: Song;
  index: number;
  onPlay?: () => void;
  isPlaying?: boolean;
}

export function SongRow({ song, index, onPlay, isPlaying }: SongRowProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "group grid grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-4 items-center px-4 py-2 rounded-md transition-colors duration-200 cursor-default",
        isPlaying ? "bg-white/10" : "hover:bg-white/10"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onPlay}
    >
      {/* Index Column */}
      <div className="text-right text-muted-foreground font-medium text-base w-4 flex justify-end">
        {isPlaying ? (
          <Play fill="#9333ea" className="w-4 h-4 text-purple-600 animate-pulse" />
        ) : isHovered ? (
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
            "text-base font-medium truncate",
            isPlaying ? "text-purple-400" : "text-white",
            isHovered && !isPlaying && "text-white"
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
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <Dialog>
            <DialogTrigger asChild>
              <button className="focus:outline-none">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground hover:text-white cursor-pointer" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#181818] border-none text-white max-w-md overflow-hidden p-0 rounded-2xl shadow-2xl">
              <div className="relative h-56 w-full">
                {/* Blurred background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-50 scale-125"
                  style={{ backgroundImage: `url(${song.coverUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#181818]" />
                
                <DialogHeader className="relative z-10 p-6 flex flex-col items-center justify-center h-full pt-12">
                  <img 
                    src={song.coverUrl} 
                    alt={song.album} 
                    className="w-36 h-36 rounded-md shadow-2xl object-cover mb-4 ring-1 ring-white/10" 
                  />
                  <div className="text-center">
                    <DialogTitle className="text-2xl font-bold tracking-tight">{song.title}</DialogTitle>
                    <p className="text-purple-400 font-semibold">{song.artist}</p>
                  </div>
                </DialogHeader>
              </div>
              
              <div className="px-8 pb-10 pt-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Song Meaning</h3>
                <ScrollArea className="h-[280px] rounded-xl bg-black/30 p-6 ring-1 ring-white/5">
                  <p className="text-base leading-relaxed text-white/90 font-medium">
                    {song.meaning || "This song explores themes of artistic expression and creative energy."}
                  </p>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
