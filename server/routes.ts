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
    { 
      title: "Ric Flair Drip", 
      artist: "Metro Boomin & Offset", 
      album: "Without Warning", 
      duration: "2:53", 
      coverUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/de/21_Savage%2C_Offset_%26_Metro_Boomin_-_Without_Warning.png/250px-21_Savage%2C_Offset_%26_Metro_Boomin_-_Without_Warning.png", 
      meaning: "The flamboyant lifestyle and high-energy success are compared through the use of vibrant metaphors and cultural allusions, particularly the figure of Ric Flair, symbolizing exuberant confidence and material achievement." 
    },
    { 
      title: "Gangsta's Paradise", 
      artist: "Coolio", 
      album: "Gangsta's Paradise", 
      duration: "4:17", 
      coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuTvX_oWfqXAXpIE_WGvHJwh0N6c9dP7uzMA&s", 
      meaning: "This track utilizes a solemn, haunting melody and poignant biblical allusions (Psalm 23) to create an ironic juxtaposition between the spiritual ideal of paradise and the harsh, cyclical reality of urban struggle." 
    },
    { 
      title: "Double Life", 
      artist: "Pharrell Williams", 
      album: "Despicable Me 4", 
      duration: "3:13", 
      coverUrl: "https://i.scdn.co/image/ab67616d0000b2735c80411d3a12be9220b39700", 
      meaning: "The song employs rhythmic syncopation and a dualistic lyrical structure to mirror the theme of hidden identities, using energetic production to mask the underlying complexity of living a split existence." 
    },
    { 
      title: "Chicago Freestyle", 
      artist: "Drake & Giveon", 
      album: "Dark Lane Demo Tapes", 
      duration: "3:42", 
      coverUrl: "https://cdn-images.dzcdn.net/images/cover/d46b7a8aa40ef7f09d71a03c2ce8edcd/500x500.jpg", 
      meaning: "A melancholic use of intertextuality (referencing Eminem's 'Superman') combined with Giveon's deep, baritone vocal texture, establishing an atmosphere of introspective isolation and the fleeting nature of fame." 
    },
    { 
      title: "Thriller", 
      artist: "Michael Jackson", 
      album: "Thriller", 
      duration: "5:58", 
      coverUrl: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png", 
      meaning: "Employing cinematic soundscapes and personification of horror tropes, the lyrics weave a narrative of suspense that functions as an allegory for the visceral thrill and paralyzing fear of the unknown." 
    },
    { 
      title: "Bad to the Bone", 
      artist: "George Thorogood & The Destroyers", 
      album: "Bad to the Bone", 
      duration: "4:51", 
      coverUrl: "https://m.media-amazon.com/images/I/71U2o+v6kVL._UF1000,1000_QL80_.jpg", 
      meaning: "The driving, repetitive blues riff serves as an auditory hyperbole for the persona's legendary toughness, while the gritty vocal delivery reinforces the unapologetic, rebellious spirit of the protagonist." 
    },
    { 
      title: "God's Plan", 
      artist: "Drake", 
      album: "Scorpion", 
      duration: "3:19", 
      coverUrl: "https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=200&auto=format&fit=crop", 
      meaning: "The track explores the concept of pre-determinism and cosmic irony, contrasting the envy of adversaries with the narrator's sense of divine protection and the inevitable path of success." 
    },
    { 
      title: "Can't Stop", 
      artist: "Red Hot Chili Peppers", 
      album: "By the Way", 
      duration: "4:30", 
      coverUrl: "https://upload.wikimedia.org/wikipedia/en/8/8e/RedHotChiliPeppersCantStop.jpg", 
      meaning: "The frenetic, percussive vocal delivery and abstract imagery create an impressionistic portrait of creative momentum, celebrating the unstoppable drive of individual expression and the vitality of the present moment." 
    },
    { 
      title: "7 minute drill", 
      artist: "J. Cole", 
      album: "Might Delete Later", 
      duration: "3:33", 
      coverUrl: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop", 
      meaning: " COLE exhibits lyrical dexterity through dense internal rhyme schemes and extended metaphors, using a high-pressure narrative frame to critique the artistic industry and assert his technical dominance." 
    }
  ];

  for (const song of songsData) {
    await storage.createSong({
      ...song,
      playlistId: 1
    });
  }
  
  console.log("Database seeded successfully!");
}
