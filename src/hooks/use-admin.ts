"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import adminsService from "@/services/admins.service";
import {
  ICreatePartnerForm,
  IUpdatePartnerForm,
} from "@/shared/types/partners.types";

const PARTNERS_QUERY_KEY = ["partners"] as const;

type UseAdminParams = {
  partnersList?: {
    page?: number;
    page_size?: number;
    search?: string;
  };
};

export const useAdmin = (params?: UseAdminParams) => {
  // Profile query (backward compatible shape is returned via spread at the end)
  const profileQuery = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const response = await adminsService.getProfile();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
  });

  // Partners list query (disabled unless requested)
  const page = params?.partnersList?.page ?? 1;
  const page_size = params?.partnersList?.page_size ?? 10;
  const search = params?.partnersList?.search ?? "";
  const partnersListQuery = useQuery({
    queryKey: [...PARTNERS_QUERY_KEY, page, page_size, search],
    queryFn: async () => {
      const res = await adminsService.listPartners(page, page_size, search);
      return res.data;
    },
    enabled: Boolean(params?.partnersList),
  });

  // Mutations
  const queryClient = useQueryClient();

  const createPartnerMutation = useMutation({
    mutationFn: (data: ICreatePartnerForm) => adminsService.createPartner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY });
    },
  });

  const updatePartnerDirect = useMutation({
    mutationFn: ({
      partnerId,
      data,
    }: {
      partnerId: number;
      data: IUpdatePartnerForm;
    }) => adminsService.updatePartner(partnerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY });
    },
  });

  const updatePartnerProfile = useMutation({
    mutationFn: (data: IUpdatePartnerForm) =>
      adminsService.updatePartnerProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
    },
  });

  const updatePartnerMutation = useMutation({
    mutationFn: (data: IUpdatePartnerForm) =>
      adminsService.updatePartner(
        (params as { partnerId?: number })?.partnerId ?? 0,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY });
    },
  });

  const togglePartnerMutation = useMutation({
    mutationFn: (partnerId: number) => adminsService.togglePartner(partnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY });
    },
  });

  const deletePartnerMutation = useMutation({
    mutationFn: (partnerId: number) => adminsService.deletePartner(partnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY });
    },
  });

  return {
    // Profile
    ...profileQuery,
    profileQuery,

    // Partners API
    partners: {
      listQuery: partnersListQuery,
      create: createPartnerMutation.mutateAsync,
      update: updatePartnerMutation.mutateAsync,
      updateDirect: updatePartnerDirect.mutateAsync,
      updateProfile: updatePartnerProfile.mutateAsync,
      toggle: togglePartnerMutation.mutateAsync,
      delete: deletePartnerMutation.mutateAsync,
      isCreating: createPartnerMutation.isPending,
      isUpdating:
        updatePartnerMutation.isPending ||
        updatePartnerDirect.isPending ||
        updatePartnerProfile.isPending,
      isToggling: togglePartnerMutation.isPending,
      isDeleting: deletePartnerMutation.isPending,
    },
  } as const;
};
