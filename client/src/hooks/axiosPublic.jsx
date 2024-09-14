import axios from "axios";

export const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
const useAxiosPublic = () => {
  return axiosSecure;
};

export default useAxiosPublic;
