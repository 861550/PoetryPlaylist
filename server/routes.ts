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
    { title: "Ric Flair Drip", artist: "Metro Boomin & Offset", album: "Without Warning", duration: "2:53", coverUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/de/21_Savage%2C_Offset_%26_Metro_Boomin_-_Without_Warning.png/250px-21_Savage%2C_Offset_%26_Metro_Boomin_-_Without_Warning.png", meaning: "Poetic devices in 'Ric Flair Drip' include hyperbole to emphasize wealth and confidence, as well as vivid imagery to describe the flamboyant lifestyle. The rhythmic flow mirrors the energy of the track." },
    { title: "Gangsta's Paradise", artist: "Coolio", album: "Gangsta's Paradise", duration: "4:17", coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuTvX_oWfqXAXpIE_WGvHJwh0N6c9dP7uzMA&s", meaning: "This song utilizes biblical allusions and heavy symbolism to reflect the harsh realities of life. The use of metaphor and mood creates a hauntingly poetic atmosphere." },
    { title: "Double Life", artist: "Pharrell Williams", album: "Despicable Me 4", duration: "3:13", coverUrl: "https://i.scdn.co/image/ab67616d0000b2735c80411d3a12be9220b39700", meaning: "Juxtaposition is used to explore the dual nature of identities. The upbeat tempo contrasts with the underlying themes of hidden layers in personal narratives." },
    { title: "Chicago Freestyle", artist: "Drake & Giveon", album: "Dark Lane Demo Tapes", duration: "3:42", coverUrl: "https://cdn-images.dzcdn.net/images/cover/d46b7a8aa40ef7f09d71a03c2ce8edcd/500x500.jpg", meaning: "Internal rhyme and introspective monologue create a late-night, moody vibe. The song's structure mirrors a train of thought, enhancing its poetic quality." },
    { title: "Thriller", artist: "Michael Jackson", album: "Thriller", duration: "5:58", coverUrl: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png", meaning: "Narrative storytelling and personification of fear drive the song's cinematic experience. Alliteration and vivid sound descriptions heighten the suspense." },
    { title: "Bad to the Bone", artist: "George Thorogood & The Destroyers", album: "Bad to the Bone", duration: "4:51", coverUrl: "https://m.media-amazon.com/images/I/71U2o+v6kVL._UF1000,1000_QL80_.jpg", meaning: "Repetition and a driving, bluesy rhythm underscore a rebellious persona. The use of slang and colloquialism adds to the authentic, gritty poetic style." },
    { title: "God's Plan", artist: "Drake", album: "Scorpion", duration: "3:19", coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvx6t4wkSyiIfj9lX-zmkQTUvjDqVnHJ71YQ&s", meaning: "Theme of destiny is explored through simple yet powerful language. The use of direct address and repetition emphasizes gratitude and resilience." },
    { title: "Can't Stop", artist: "Red Hot Chili Peppers", album: "By the Way", duration: "4:30", coverUrl: "https://upload.wikimedia.org/wikipedia/en/8/8e/RedHotChiliPeppersCantStop.jpg", meaning: "Energetic alliteration and free-association lyrics celebrate creative drive. The song's structure is non-linear, mirroring the sporadic nature of inspiration." },
    { title: "7 Minute Drill", artist: "J. Cole", album: "Might Delete Later", duration: "3:33", coverUrl: "https://i.scdn.co/image/ab67616d0000b273b5e99d6177971707e6cd04f5", meaning: "Complex internal rhymes and metaphors showcase lyrical mastery. The song acts as a self-reflective exercise in technical wordplay and artistic competition." }
  ];

  for (const song of songsData) {
    await storage.createSong({
      ...song,
      playlistId: 1
    });
  }
  
  console.log("Database seeded successfully!");
}
