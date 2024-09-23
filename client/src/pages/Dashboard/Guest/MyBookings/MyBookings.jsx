import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import TableHead from "../../../../components/TableHead/TableHead";
import BookingDataRow from "../../../../components/BookingDataRow/BookingDataRow";
import LoadingSpinner from "../../../../components/Shared/LoadingSpinner";

const MyBookings = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();
  console.log(user, "the user");

  const {
    data: myBookings,
    isLoading,
    error,
    refetch,
  } = useQuery({
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/my-bookings/${user.email}`);
      return data;
    },
    queryKey: [user, "user-bookings"],
  });
  if (isLoading) return <LoadingSpinner />;
  if (myBookings?.length < 1) {
    return <h3>No bookings found.</h3>;
  }
  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <TableHead>#</TableHead>
                  <TableHead>Tittle</TableHead>
                  <TableHead>Info</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Action</TableHead>
                </tr>
              </thead>
              <tbody>
                {/* Room row data */}
                {myBookings?.map((item, index) => {
                  return (
                    <BookingDataRow
                      key={index}
                      booking={item}
                      refetch={refetch}
                      index={index}
                    />

                  
                  );
                })}
  

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
