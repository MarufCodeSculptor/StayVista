import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./axiosPublic";
import { useSearchParams } from "react-router-dom";

const useRoomsData = () => {
  const [params, setParams] = useSearchParams();
  const category = params.get("category");

  const axiosPublic = useAxiosPublic();

  const {
    data: rooms = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rooms", category],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/rooms?category=${category}`);
      return data;
    },
  });

  return [isLoading, error, rooms];
};

export default useRoomsData;
