
REVOKE EXECUTE ON FUNCTION public.owns_profile(UUID) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.can_access_story(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.owns_profile(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_story(UUID) TO authenticated;
