import { Helmet } from "react-helmet-async";
import TableHead from "../../../components/TableHead/TableHead";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import RoomsDataRow from "../../../components/RoomDataRow/RoomsDataRow";
import toast from "react-hot-toast";

const MyListings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

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
  //  handling remove data => use useMutaaiosn
  const { mutateAsync } = useMutation({
    mutationKey: ["remove-room"],
    mutationFn: async (roomdId) => {
      const { data } = await axiosSecure.delete(`/room/${roomdId}`);
      return data;
    },

    onSuccess: async (data) => {
      if (data.deletedCount > 0) toast.success("Deleted successfully");
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
