import { format } from "date-fns";
import PropTypes from "prop-types";
import { useState } from "react";
import DeleteModal from "../Modal/DeleteModal";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const BookingDataRow = ({ booking, refetch, index }) => {
  const axiosSecure = useAxiosSecure();
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const [proccessing, setProccessing] = useState(false);
  //  posting bookings data to database  = >
  const { mutateAsync: removeBooking } = useMutation({
    mutationKey: ["removeBooking"],
    mutationFn: async (id) => {
      const { data } = await axiosSecure.delete(`/booking/${id}`);
      return data;
    },
    onSuccess: async (data) => {
      console.log(data, "from remove bookings");
      await updateRoom({ booked: false });
    },
  });
  //  updationg room's status  = >
  const { mutateAsync: updateRoom } = useMutation({
    mutationKey: ["update-room"],
    mutationFn: async (status) => {
      const { data } = await axiosSecure.patch(
        `/room-status/update/${booking.roomId}`,
        status
      );
      return data;
    },
    onSuccess: async (data) => {
      //  something will happen here
      console.log(data, "the uupdate success data");
      if (data.modifiedCount > 0) {
        closeModal();
        toast.success("cencel success");
        setProccessing(false);
        refetch();
      }
    },
  });

  // make booking  removing mutaions

  const handleCencel = async (id) => {
    setProccessing(true);
    await removeBooking(id);
  };

  return (
    <tr>
      <td> {index + 1} </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="block relative">
              <img
                alt="profile"
                src={booking?.image}
                className="mx-auto object-cover rounded h-10 w-15 "
              />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-gray-900 whitespace-no-wrap">{booking?.title}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="block relative">
              <img
                alt="profile"
                src={booking?.guest?.image}
                className="mx-auto object-cover rounded h-10 w-15 "
              />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-gray-900 whitespace-no-wrap">
              {booking?.guest?.name}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">${booking?.price}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {format(new Date(booking?.from), "P")}
        </p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {format(new Date(booking?.to), "P")}
        </p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <button
          onClick={() => setOpen(true)}
          className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
          ></span>
          <span className="relative">Cancel</span>
        </button>
        {/* cancel modal is sit here */}

        <DeleteModal
          handleClose={closeModal}
          isOpen={open}
          handleDelete={handleCencel}
          id={booking._id}
          inProgress={proccessing}
        />
      </td>
    </tr>
  );
};

BookingDataRow.propTypes = {
  booking: PropTypes.object,
  refetch: PropTypes.func,
  index: PropTypes.number,
};

export default BookingDataRow;
