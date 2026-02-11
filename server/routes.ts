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
    // Force update to match requested details
    await storage.updatePlaylist(1, playlistData);
    
    // Check if songs need update (simple check: if first song isn't Ric Flair Drip)
    const currentSongs = await storage.getPlaylistSongs(1);
    if (currentSongs.length > 0 && currentSongs[0].title === "Ric Flair Drip") {
      return; 
    }
    
    // Clear and re-add songs to ensure correct order/details
    await storage.clearPlaylistSongs(1);
  } else {
    await storage.createPlaylist(playlistData);
  }

  const songsData = [
    { title: "Ric Flair Drip", artist: "Metro Boomin & Offset", album: "Without Warning", duration: "2:52", coverUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/de/21_Savage%2C_Offset_%26_Metro_Boomin_-_Without_Warning.png/250px-21_Savage%2C_Offset_%26_Metro_Boomin_-_Without_Warning.png", meaning: "This song is a high-energy celebration of success and the lavish lifestyle associated with it. The 'Ric Flair Drip' refers to the flamboyant style of legendary wrestler Ric Flair, symbolizing wealth and confidence. Offset's verses describe his journey to the top, while Metro Boomin's production provides a hard-hitting backdrop. It's an anthem of achievement and style." },
    { title: "Instant Crush", artist: "Daft Punk", album: "Random Access Memories", duration: "5:37", coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop", meaning: "A nostalgic look at a sudden attraction that feels like it could last forever, even if it's only for a moment. It captures the bittersweet essence of fleeting connections." },
    { title: "The Less I Know The Better", artist: "Tame Impala", album: "Currents", duration: "3:36", coverUrl: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop", meaning: "A relatable tale of romantic disappointment and the painful process of moving on. The disco-infused beat masks the underlying heartache of seeing a former flame with someone else." },
    { title: "Breezeblocks", artist: "Alt-J", album: "An Awesome Wave", duration: "3:47", coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=200&auto=format&fit=crop", meaning: "A complex exploration of an obsessive relationship. It uses vivid imagery and literary references to describe the desperate desire to hold onto someone, even when the relationship has turned toxic." },
    { title: "Do I Wanna Know?", artist: "Arctic Monkeys", album: "AM", duration: "4:32", coverUrl: "https://images.unsplash.com/photo-1514525253440-b393452e8d03?q=80&w=200&auto=format&fit=crop", meaning: "The song delves into the uncertainty and late-night rumination that comes with unrequited feelings or a complicated relationship. The heavy, bluesy riff underscores the intensity of the emotions." },
    { title: "Safe And Sound", artist: "Capital Cities", album: "In A Tidal Wave Of Mystery", duration: "3:13", coverUrl: "https://images.unsplash.com/photo-1459749411177-71296491864c?q=80&w=200&auto=format&fit=crop", meaning: "An optimistic anthem about finding safety and comfort in a loved one despite the chaos of the world. It's a celebration of resilience and companionship." },
    { title: "Pumped Up Kicks", artist: "Foster The People", album: "Torches", duration: "4:00", coverUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=200&auto=format&fit=crop", meaning: "While the melody is catchy and upbeat, the lyrics offer a dark commentary on youth alienation. It serves as a reminder to look beneath the surface of pop culture." },
    { title: "Sweater Weather", artist: "The Neighbourhood", album: "I Love You.", duration: "4:00", coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200&auto=format&fit=crop", meaning: "A moody, atmospheric track that captures the feeling of intimacy and the desire for closeness during the colder months. It's a song about find warmth in another person." },
    { title: "Team", artist: "Lorde", album: "Pure Heroine", duration: "3:13", coverUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?q=80&w=200&auto=format&fit=crop", meaning: "A celebration of teenage community and the shared experience of growing up in a place that feels distinct from the mainstream. It's about finding strength in your own 'team'." },
    { title: "Electric Feel", artist: "MGMT", album: "Oracular Spectacular", duration: "3:49", coverUrl: "https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=200&auto=format&fit=crop", meaning: "A psychedelic, disco-tinged track about the powerful, almost supernatural attraction between two people. It's a sonic journey through a landscape of pure energy." }
  ];

  for (const song of songsData) {
    await storage.createSong({
      ...song,
      playlistId: 1
    });
  }
  
  console.log("Database seeded successfully!");
}
