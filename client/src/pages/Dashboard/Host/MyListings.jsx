import { Helmet } from "react-helmet-async";
import TableHead from "../../../components/TableHead/TableHead";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import RoomsDataRow from "../../../components/RoomDataRow/RoomsDataRow";
import toast from "react-hot-toast";
import { postImage } from "../../../api/utils";
import { useState } from "react";

const MyListings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [inProgress,setInProgress] =useState(false)

  //  getting users adding data
  const {
    data: mylistings,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-listings", user],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/my-listings/${user?.email}`);
      return data;
    },
  });
  //  handle  delete  code :
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };

  const deltedModalConfig = {
    isOpen,
    handle: { handleClose, setIsOpen },
  };



  const { mutateAsync } = useMutation({
    mutationKey: ["remove-room"],
    mutationFn: async (roomdId) => {
      const { data } = await axiosSecure.delete(`/room/${roomdId}`);
      return data;
    },

    onSuccess: async (data) => {
      if (data.deletedCount > 0) {
        toast.success("Deleted successfully");
        // make modal delete modal close :
        handleClose()
      }
    },
  });

  const handleDelete = async (roomId) => {
    try {
      await mutateAsync(roomId);
      refetch();
    } catch (err) {
      console.log(err, "from deleting request for rooms");
    }
  };
  // update related codes :

  // update modal's state and function :
  const [open, setOpen] = useState(false);
  const setClose = () => setOpen(false);
  const updateModalConfig = {
    open,
    handle: { setClose, setOpen },
  };

  const { mutateAsync: updateRoom } = useMutation({
    mutationKey: ["image-update"],
    mutationFn: async ({ room, id }) => {
      const { data } = await axiosSecure.put(`/room/${id}`, room);
      return data;
    },

    onSuccess: async (data) => {
      console.log(data, "rooms posting response");
      if (data.modifiedCount) {
        toast.success("successfully posted data");
        setClose();
      }
    },
  });

  const handleUpdate = async (formData) => {
    console.log("argumenst resutls", formData);
    const { form, state, id } = formData;

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
      const imageURL = await postImage(image);

      if (imageURL) {
        const updatedRoom = {
          title,
          description,
          location,
          category,
          price,
          guests,
          bathrooms,
          bedrooms,
          image: imageURL,
          to: state.startDate,
          from: state.endDate,
        };
        await updateRoom({ room: { ...updatedRoom }, id });
        refetch();
      }
    } catch (err) {
      // print error here
      console.log(err);
    } finally {
      setClose();
    }
  };

  // update related code end here

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-3xl text-red-400">
        data not found {error?.message}
      </div>
    );

  return (
    <>
      <Helmet>
        <title>My Listings</title>
      </Helmet>

      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <TableHead>#</TableHead>
                    <TableHead>Tittle</TableHead>
                    <TableHead>location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Delete</TableHead>
                    <TableHead>Update</TableHead>
                  </tr>
                </thead>
                <tbody>
                  {/* Room row data */}

                  {mylistings.map((item, index) => {
                    return (
                      <RoomsDataRow
                        key={item._id}
                        room={item}
                        index={index}
                        refetch={refetch}
                        handleDelete={handleDelete}
                        user={user}
                        handleUpdate={handleUpdate}
                        updateModalConfig={updateModalConfig}
                        deltedModalConfig={deltedModalConfig}
                        inProgress={inProgress}
                      ></RoomsDataRow>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyListings;
