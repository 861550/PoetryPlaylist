import { playlists, songs, type Playlist, type Song, type InsertPlaylist, type InsertSong } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getPlaylist(id: number): Promise<Playlist | undefined>;
  getPlaylistSongs(playlistId: number): Promise<Song[]>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  createSong(song: InsertSong): Promise<Song>;
  updatePlaylist(id: number, playlist: Partial<InsertPlaylist>): Promise<Playlist>;
  clearPlaylistSongs(playlistId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getPlaylist(id: number): Promise<Playlist | undefined> {
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));
    return playlist;
  }

  async getPlaylistSongs(playlistId: number): Promise<Song[]> {
    return await db.select().from(songs).where(eq(songs.playlistId, playlistId));
  }

  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const [playlist] = await db.insert(playlists).values(insertPlaylist).returning();
    return playlist;
  }

  async createSong(insertSong: InsertSong): Promise<Song> {
    const [song] = await db.insert(songs).values(insertSong).returning();
    return song;
  }

  async updatePlaylist(id: number, playlist: Partial<InsertPlaylist>): Promise<Playlist> {
    const [updated] = await db.update(playlists).set(playlist).where(eq(playlists.id, id)).returning();
    return updated;
  }

  async clearPlaylistSongs(playlistId: number): Promise<void> {
    await db.delete(songs).where(eq(songs.playlistId, playlistId));
  }
}

export const storage = new DatabaseStorage();
