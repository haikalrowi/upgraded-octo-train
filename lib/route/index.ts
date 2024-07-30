const route = {
  home: "/",
  dashboard_home: "/dashboard",
  dashboard_presentation_home: "/dashboard/presentation",
  dashboard_presentation_create: "/dashboard/presentation/create",
  dashboard_presentation_update: "/dashboard/presentation/update",
  dashboard_presentation_update_id: (id: string) =>
    `/dashboard/presentation/update/${id}` as const,
} as const;

export default route;
