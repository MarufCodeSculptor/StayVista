import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./axiosPublic";

const useRoomsData = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: rooms = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/rooms");
      console.log(data);
      return data;
    },
  });

  return [isLoading, error, rooms];
};

export default useRoomsData;
