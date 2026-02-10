import { z } from 'zod';
import { insertPlaylistSchema, insertSongSchema, playlists, songs } from './schema';

export const errorSchemas = {
  notFound: z.object({
    message: z.string(),
  }),
};

export const api = {
  playlists: {
    get: {
      method: 'GET' as const,
      path: '/api/playlists/:id' as const,
      responses: {
        200: z.custom<typeof playlists.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    getSongs: {
      method: 'GET' as const,
      path: '/api/playlists/:id/songs' as const,
      responses: {
        200: z.array(z.custom<typeof songs.$inferSelect>()),
        404: errorSchemas.notFound,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
