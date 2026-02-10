import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { Playlist, Song } from "@shared/schema";

export function usePlaylist(id: number) {
  return useQuery({
    queryKey: [api.playlists.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.playlists.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch playlist");
      return api.playlists.get.responses[200].parse(await res.json());
    },
  });
}

export function usePlaylistSongs(id: number) {
  return useQuery({
    queryKey: [api.playlists.getSongs.path, id],
    queryFn: async () => {
      const url = buildUrl(api.playlists.getSongs.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return [];
      if (!res.ok) throw new Error("Failed to fetch songs");
      return api.playlists.getSongs.responses[200].parse(await res.json());
    },
  });
}
