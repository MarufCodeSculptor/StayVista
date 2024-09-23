import { useState } from "react";
import AddRoomForm from "../../../components/AddRoomsForm/AddRoomForm";
import { postImage } from "../../../api/utils";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { Helmet } from "react-helmet-async";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Addrooms = () => {
  const [dataProccecing, setDataProccesing] = useState(false);
  const [state, setState] = useState({
    startDate: new Date(),
    endDate: null,
    key: "selection",
  });
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  //   date range handler =>
  const handleDates = (item) => {
    setState(item.selection);
  };
  const { mutateAsync } = useMutation({
    mutationKey: ["image-post"],
    mutationFn: async (roomsData) => {
      const { data } = await axiosSecure.post("/room", roomsData);
      return data;
    },

    onSuccess: async (data) => {
      console.log(data,"rooms posting response");
      toast.success("successfully posted data");
    },
  });
  // form handle function =>
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDataProccesing(true);
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const location = form.location.value;
    const category = form.category.value;
    const price = form.price.value;
    const guests = form.guests.value;
    const bathrooms = form.bathrooms.value;
    const bedrooms = form.bedrooms.value;
    const image = form.image.files[0];

    try {
      const imageUrl = await postImage(image);
      if (imageUrl && user) {
        const roomsData = {
          title,
          description,
          location,
          category,
          price,
          guests,
          bathrooms,
          bedrooms,
          image: imageUrl,
          from: state.startDate,
          to: state.endDate,
          host: {
            name: user?.displayName,
            email: user?.email,
            image: user?.photoURL,
          },
        };

        const { insertedId } = await mutateAsync(roomsData);

        if (insertedId) {
          navigate("/dashboard/my-listings");
          setDataProccesing(false);
        }
      }
    } catch (err) {
      console.log(err?.message);
      setDataProccesing(false);
    }
  };

  if (dataProccecing) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Helmet>
        <title>Add Rooms| Dashboard</title>
      </Helmet>
      <div className="py-5">
        <h2 className="text-3xl text-center capitalize font-bold">
          Welcome to add rooms page
        </h2>

        <hr className="my-10" />
        <AddRoomForm
          state={state}
          handleDates={handleDates}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Addrooms;
