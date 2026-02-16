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
    coverUrl: "https://lh3.googleusercontent.com/drive-storage/AJQWtBO78JvDR5A6ujSSoDr_RUXj_GF_eunQU-4JNFttGUzipKcUF4I1cS9n9uJ60ybTFPIPWHraPyb83a5LoNdk3e-p00eR9B6_p-4x_KjBOBQtkQy5=w1600-h739?auditContext=forDisplay",
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
    { title: "Ric Flair Drip", artist: "Metro Boomin & Offset", album: "Without Warning", duration: "2:53", coverUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/de/21_Savage%2C_Offset_%26_Metro_Boomin_-_Without_Warning.png/250px-21_Savage%2C_Offset_%26_Metro_Boomin_-_Without_Warning.png", meaning: "Throughout the chorus, Offset uses an onomatopoeia “Whoo!” Symbolyzing triumph or probably some kind of celebration." },
    { title: "Gangsta’s Paradise", artist: "Coolio", album: "Gangsta's Paradise", duration: "4:17", coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuTvX_oWfqXAXpIE_WGvHJwh0N6c9dP7uzMA&s", meaning: "The opening line is a direct riff on Psalm 23:4 (\"As I walk through the valley of the shadow of death\"). By swapping the religious context for the street, it immediately creates a sense of epic, somber weight." },
    { title: "Double LIfe", artist: "Pharrell Williams", album: "Despicable Me 4", duration: "3:13", coverUrl: "https://i.scdn.co/image/ab67616d0000b2735c80411d3a12be9220b39700", meaning: "The phrase in verse one “your life double-sided, two faced like coins” is clearly a simile, stating how one has a secret life that they (probably) don’t show to anyone else." },
    { title: "Chicago Freestyle", artist: "Drake & Giveon", album: "Dark Lane Demo Tapes", duration: "3:42", coverUrl: "https://cdn-images.dzcdn.net/images/cover/d46b7a8aa40ef7f09d71a03c2ce8edcd/500x500.jpg", meaning: "Drake features a form of interpolation from one of Eminem’s songs in the pre-chorus. (Interpolation basically means to take something and and alters it to create a new song, poem, etc)" },
    { title: "Thriller", artist: "Michael Jackson", album: "Thriller", duration: "5:58", coverUrl: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png", meaning: "Other than the lyrics, the use of creaking doors, howling wolves, and thunder serves as an onomatopoeia, where the sounds themselves represent the entire horror genre." },
    { title: "Bad to the Bone", artist: "George Thorogood & The Destroyers", album: "Bad to the Bone", duration: "4:51", coverUrl: "https://m.media-amazon.com/images/I/71U2o+v6kVL._UF1000,1000_QL80_.jpg", meaning: "Clearly showing a metaphor in the title, the phrase “Bad to the Bone” explains how one has no remorse for anything." },
    { title: "God’s Plan", artist: "Drake", album: "Scorpion", duration: "3:19", coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvx6t4wkSyiIfj9lX-zmkQTUvjDqVnHJ71YQ&s", meaning: "Drake repeatedly says \"they wishin\" over and over. I thought he just needed some kind of filler for his lyrics, but it’s actually a form of repetition." },
    { title: "Can’t Stop", artist: "Red Hot Chili Peppers", album: "By the Way", duration: "4:30", coverUrl: "https://upload.wikimedia.org/wikipedia/en/8/8e/RedHotChiliPeppersCantStop.jpg", meaning: "RHCP uses \"like\" or \"as\" to make weird comparisons, which helps create a somewhat energetic feeling." },
    { title: "7 Minute Drill", artist: "J. Cole", album: "Might Delete Later", duration: "3:33", coverUrl: "https://i.scdn.co/image/ab67616d0000b273b5e99d6177971707e6cd04f5", meaning: "J. Cole treats \"the rap game\" like it’s a real person he can talk to, fight with, or look down on." }
  ];

  for (const song of songsData) {
    await storage.createSong({
      ...song,
      playlistId: 1
    });
  }
  
  console.log("Database seeded successfully!");
}
