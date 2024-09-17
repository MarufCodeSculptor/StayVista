import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useUserData = () => {
  const axiosSecure = useAxiosSecure();

  const getData = async () => {
    const { data } = await axiosSecure.get("/users");
    return data;
  };

  const { data:users,isLoading,error,refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getData,
  });

  return {users,isLoading,error,refetch};
};

export default useUserData;
