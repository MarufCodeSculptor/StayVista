import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();

  const {
    data: role,
    isLoading,
    error,
    refetch,
  } = useQuery({
    anabled: !loading && !!user?.email,
    queryKey: ["user-role", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/user-role/${user?.email}`);
      return data.role;
    },
  });

  return { role, isLoading, error, refetch };
};

export default useRole;
