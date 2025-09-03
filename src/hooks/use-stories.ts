"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storiesService } from "@/services/stories.service";
import { StoryUpdateData } from "@/shared/types/stories.types";

export const useStories = (page = 1, pageSize = 20, search = "") => {
  const queryClient = useQueryClient();

  const storiesQuery = useQuery({
    queryKey: ["stories", page, pageSize, search],
    queryFn: () => storiesService.getStories(page, pageSize, search),
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });

  const updateStoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: StoryUpdateData }) =>
      storiesService.updateStory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async (file: File) => {
      const result = await storiesService.bulkUpdateFromFile(file);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  const downloadDumpMutation = useMutation({
    mutationFn: () => storiesService.downloadDump(),
  });

  const getStoryById = async (id: string) => {
    return await storiesService.getStoryById(id);
  };

  return {
    // Query data
    stories: storiesQuery.data?.items || [],
    pagination: {
      total: storiesQuery.data?.total || 0,
      page: storiesQuery.data?.page || 1,
      page_size: storiesQuery.data?.page_size || 20,
      pages: storiesQuery.data?.pages || 0,
    },
    loading: storiesQuery.isLoading,
    error: storiesQuery.error,

    // Mutations
    updateStory: updateStoryMutation.mutate,
    updateStoryAsync: updateStoryMutation.mutateAsync,
    updateStoryLoading: updateStoryMutation.isPending,
    updateStoryError: updateStoryMutation.error,

    bulkUpdate: bulkUpdateMutation.mutate,
    bulkUpdateAsync: bulkUpdateMutation.mutateAsync,
    bulkUpdateLoading: bulkUpdateMutation.isPending,
    bulkUpdateError: bulkUpdateMutation.error,

    downloadDump: downloadDumpMutation.mutate,
    downloadDumpAsync: downloadDumpMutation.mutateAsync,
    downloadDumpLoading: downloadDumpMutation.isPending,

    // Actions
    getStoryById,
    refetch: storiesQuery.refetch,
  };
};
