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
    { title: "Ric Flair Drip", artist: "Metro Boomin & Offset", album: "Without Warning", duration: "2:53", coverUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/de/21_Savage%2C_Offset_%26_Metro_Boomin_-_Without_Warning.png/250px-21_Savage%2C_Offset_%26_Metro_Boomin_-_Without_Warning.png", meaning: "Within the chorus, Offset frequently uses 'Whoo!' as an ad-lib to emphasize the song's energy and excitement. Almost as if it's triumph or celebration."},
    { title: "Gangsta's Paradise", artist: "Coolio", album: "Gangsta's Paradise", duration: "4:17", coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuTvX_oWfqXAXpIE_WGvHJwh0N6c9dP7uzMA&s", meaning: "Most of this song is basically just metaphors. The first line of the whole song states 'As I walk through the valley of the shadow of death, I take a look at my life and realize there's nothin left.' Pretty funny when I came across this song."},
    { title: "Double Life", artist: "Pharrell Williams", album: "Despicable Me 4", duration: "3:13", coverUrl: "https://i.scdn.co/image/ab67616d0000b2735c80411d3a12be9220b39700", meaning: "Within the first verse, I found a simile. Heres the line: 'Your life double-sided, two-faced like coins.'" },
    { title: "Chicago Freestyle", artist: "Drake & Giveon", album: "Dark Lane Demo Tapes", duration: "3:42", coverUrl: "https://cdn-images.dzcdn.net/images/cover/d46b7a8aa40ef7f09d71a03c2ce8edcd/500x500.jpg", meaning: "In the first section with Giveon's melodic intro, at the end (just before Drake starts), he says 'Will I see you at the show tonight?', which is a form of repetition."},
    { title: "Thriller", artist: "Michael Jackson", album: "Thriller", duration: "5:58", coverUrl: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png", meaning: "THIS is an iconic song. We can see a metaphor being used in the intro that says 'You see a sight that almost stops your heart'." },
    { title: "Bad to the Bone", artist: "George Thorogood & The Destroyers", album: "Bad to the Bone", duration: "4:51", coverUrl: "https://m.media-amazon.com/images/I/71U2o+v6kVL._UF1000,1000_QL80_.jpg", meaning: "Switching to a classic rock song, the title clearly shows a metaphor. For those who clearly can't see it, the metaphor is 'Bad to the Bone'. The song also features a small repeptition in the chorus: 'B-B-B-Bad'."},
    { title: "God's Plan", artist: "Drake", album: "Scorpion", duration: "3:19", coverUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Scorpion_by_Drake.jpg/250px-Scorpion_by_Drake.jpg", meaning: "Another Drake song, showing another repetition piece in the intro and the chorus: 'They wishin and wishin and wishin and wishin they wishin on me, yeah'."},
    { title: "Can't Stop", artist: "Red Hot Chili Peppers", album: "By the Way", duration: "4:30", coverUrl: "https://upload.wikimedia.org/wikipedia/en/8/8e/RedHotChiliPeppersCantStop.jpg", meaning: "In this song, at the end/outro, there is a metaphor that states: 'This life is more than just a readthrough'." },
    { title: "7 Minute Drill", artist: "J. Cole", album: "Might Delete Later", duration: "3:33", coverUrl: "https://upload.wikimedia.org/wikipedia/en/a/a6/Might_Delete_Later.png", meaning: "This song showcases a simile in the second section of verse one that states: 'He still doin shows, but fell off like the Simpsons', which, by the way, did have a major fall-off (yes I watched the show)" }
  ];

  for (const song of songsData) {
    await storage.createSong({
      ...song,
      playlistId: 1
    });
  }
  
  console.log("Database seeded successfully!");
}
