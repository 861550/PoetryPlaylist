import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  author: text("author").notNull(),
  coverUrl: text("cover_url").notNull(),
  likes: integer("likes").default(0),
});

export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").notNull(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  album: text("album").notNull(),
  coverUrl: text("cover_url").notNull(),
  duration: text("duration").notNull(),
});

export const insertPlaylistSchema = createInsertSchema(playlists).omit({ id: true });
export const insertSongSchema = createInsertSchema(songs).omit({ id: true });

export type Playlist = typeof playlists.$inferSelect;
export type Song = typeof songs.$inferSelect;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type InsertSong = z.infer<typeof insertSongSchema>;
