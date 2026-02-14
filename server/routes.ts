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
  const playlistData = {
    name: "Poetry Playlist",
    description: "English Poetry Playlist",
    author: "Krish 78FI",
    coverUrl: "https://lh3.googleusercontent.com/drive-storage/AJQWtBPQ9D31HdFhktF31LbbkZ7Fru-XGdWJMlm7FHF_4pN8tF-6r5tOF_C-476YjLxI4bNVE7HMZifTudPf3B6VmDBpKmiebxLNnUS1LaleqZYYp3h9=w1366-h647?auditContext=forDisplay",
    likes: 12345,
  };

  const existing = await storage.getPlaylist(1);
  if (existing) {
    await storage.updatePlaylist(1, playlistData);
    await storage.clearPlaylistSongs(1);
  } else {
    await storage.createPlaylist(playlistData);
  }

  const songsData = [
    { title: "Ric Flair Drip", artist: "Metro Boomin & Offset", album: "Without Warning", duration: "2:53", coverUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/de/21_Savage%2C_Offset_%26_Metro_Boomin_-_Without_Warning.png/250px-21_Savage%2C_Offset_%26_Metro_Boomin_-_Without_Warning.png", meaning: "This song is a high-energy celebration of success and the lavish lifestyle associated with it. The 'Ric Flair Drip' refers to the flamboyant style of legendary wrestler Ric Flair, symbolizing wealth and confidence. Offset's verses describe his journey to the top, while Metro Boomin's production provides a hard-hitting backdrop. It's an anthem of achievement and style." },
    { title: "Gangsta's Paradise", artist: "Coolio", album: "Gangsta's Paradise", duration: "4:17", coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuTvX_oWfqXAXpIE_WGvHJwh0N6c9dP7uzMA&s", meaning: "A profound reflection on the struggles and reality of life in the inner city. It explores themes of survival, mortality, and the cycle of violence, set against a hauntingly beautiful melody." },
    { title: "Double Life", artist: "Pharrell Williams", album: "Despicable Me 4", duration: "3:13", coverUrl: "https://i.scdn.co/image/ab67616d0000b2735c80411d3a12be9220b39700", meaning: "Explores the complexity of maintaining different identities or secrets. It's an upbeat yet thought-provoking track about the hidden layers of our lives." },
    { title: "Chicago Freestyle", artist: "Drake & Giveon", album: "Dark Lane Demo Tapes", duration: "3:42", coverUrl: "https://cdn-images.dzcdn.net/images/cover/d46b7a8aa40ef7f09d71a03c2ce8edcd/500x500.jpg", meaning: "A moody, late-night reflection on fame, relationships, and the isolation that often comes with success. Giveon's soulful vocals add a layer of melancholy to Drake's introspective verses." },
    { title: "Thriller", artist: "Michael Jackson", album: "Thriller", duration: "5:58", coverUrl: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png", meaning: "The ultimate cinematic pop experience, using horror themes to explore the excitement and fear of the unknown. It's a masterpiece of storytelling and production." },
    { title: "Bad to the Bone", artist: "George Thorogood & The Destroyers", album: "Bad to the Bone", duration: "4:51", coverUrl: "https://m.media-amazon.com/images/I/71U2o+v6kVL._UF1000,1000_QL80_.jpg", meaning: "A classic rock anthem about confidence and a rebellious spirit. The driving riff and gritty vocals capture a raw, unapologetic energy." },
    { title: "God's Plan", artist: "Drake", album: "Scorpion", duration: "3:19", coverUrl: "https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=200&auto=format&fit=crop", meaning: "A reflection on destiny, gratitude, and the forces that shape our paths. It's a song about humility in the face of immense success." },
    { title: "Can't Stop", artist: "Red Hot Chili Peppers", album: "By the Way", duration: "4:30", coverUrl: "https://upload.wikimedia.org/wikipedia/en/8/8e/RedHotChiliPeppersCantStop.jpg", meaning: "A high-energy celebration of passion and the unstoppable drive to follow your own creative path. It's an anthem of individuality and persistence." }
  ];

  for (const song of songsData) {
    await storage.createSong({
      ...song,
      playlistId: 1
    });
  }
  
  console.log("Database seeded successfully!");
}
