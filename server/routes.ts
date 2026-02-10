import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Playlist endpoints
  app.get(api.playlists.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(404).json({ message: "Invalid ID" });
    
    const playlist = await storage.getPlaylist(id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.json(playlist);
  });

  app.get(api.playlists.getSongs.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(404).json({ message: "Invalid ID" });

    const songs = await storage.getPlaylistSongs(id);
    res.json(songs);
  });

  // Seed data check
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getPlaylist(1);
  if (existing) return;

  const playlist = await storage.createPlaylist({
    name: "Late Night Vibes",
    description: "Chill beats to study and relax to.",
    author: "Spotify",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop",
    likes: 12345,
  });

  const songs = [
    { title: "Midnight City", artist: "M83", album: "Hurry Up, We're Dreaming", duration: "4:03", coverUrl: "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=200&auto=format&fit=crop" },
    { title: "Instant Crush", artist: "Daft Punk", album: "Random Access Memories", duration: "5:37", coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop" },
    { title: "The Less I Know The Better", artist: "Tame Impala", album: "Currents", duration: "3:36", coverUrl: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop" },
    { title: "Breezeblocks", artist: "Alt-J", album: "An Awesome Wave", duration: "3:47", coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=200&auto=format&fit=crop" },
    { title: "Do I Wanna Know?", artist: "Arctic Monkeys", album: "AM", duration: "4:32", coverUrl: "https://images.unsplash.com/photo-1514525253440-b393452e8d03?q=80&w=200&auto=format&fit=crop" },
    { title: "Safe And Sound", artist: "Capital Cities", album: "In A Tidal Wave Of Mystery", duration: "3:13", coverUrl: "https://images.unsplash.com/photo-1459749411177-71296491864c?q=80&w=200&auto=format&fit=crop" },
    { title: "Pumped Up Kicks", artist: "Foster The People", album: "Torches", duration: "4:00", coverUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=200&auto=format&fit=crop" },
    { title: "Sweater Weather", artist: "The Neighbourhood", album: "I Love You.", duration: "4:00", coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200&auto=format&fit=crop" },
    { title: "Team", artist: "Lorde", album: "Pure Heroine", duration: "3:13", coverUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?q=80&w=200&auto=format&fit=crop" },
    { title: "Electric Feel", artist: "MGMT", album: "Oracular Spectacular", duration: "3:49", coverUrl: "https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=200&auto=format&fit=crop" }
  ];

  for (const song of songs) {
    await storage.createSong({
      ...song,
      playlistId: playlist.id
    });
  }
  
  console.log("Database seeded successfully!");
}
