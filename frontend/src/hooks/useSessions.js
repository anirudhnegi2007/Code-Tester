import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../componets/lib/axios";
import { auth } from "../firebase/config";

async function getAuthHeaders() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  const token = await user.getIdToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export function useSessionById(id) {
  return useQuery({
    queryKey: ["session", id],
    queryFn: async () => {
      if (!id) return null;
      const headers = await getAuthHeaders();
      const response = await axiosInstance.get(`/api/session/${id}`, headers);
      return response.data;
    },
    enabled: !!id,
    refetchInterval: 10000, // Poll every 10 seconds to keep track of participants or status changes
  });
}

export function useJoinSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const headers = await getAuthHeaders();
      const response = await axiosInstance.post(`/api/session/${id}/join`, {}, headers);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["session", id] });
    },
  });
}

export function useEndSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const headers = await getAuthHeaders();
      const response = await axiosInstance.post(`/api/session/${id}/end`, {}, headers);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["session", id] });
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
      queryClient.invalidateQueries({ queryKey: ["recentSessions"] });
    },
  });
}
