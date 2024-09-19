import PropTypes from "prop-types";
import { format } from "date-fns";
import DeleteModal from "../Modal/DeleteModal";
import { useState } from "react";
import RoomUpdateModal from "../Modal/RoomUpdateModal/RoomUpdateModal";

const RoomDataRow = ({ room, index, handleDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  // form related state and functions =>
  const [imagePreview, setImagePreview] = useState(room.image);
  const [imageTitle, setImageTitle] = useState("_Select Image");
  const handleImage = (image) => {
    setImagePreview(URL.createObjectURL(image.target.files[0]));
    setImageTitle(image.target.files[0].name);
  };

  const [state, setState] = useState({
    startDate: room.from,
    endDate: room.to,
    key: "selection",
  });

  const handleDates = (item) => {
    setState(item.selection);
  };
  const formsValue = {
    formsState: {
      imagePreview: imagePreview,
      imageTitle: imageTitle,
      state: state,
    },
    funcs: { handleDates: handleDates, handleImage: handleImage },
  };


  // make a modal for showing previous information
  const [open, setOpen] = useState(false);
  const setClose = () => setOpen(false);

  const handleUpdate = async (form) => {
    console.log("argumenst resutls", form);
  };

  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {index + 1}
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="block relative">
              <img
                alt="profile"
                src={room?.image}
                className="mx-auto object-cover rounded h-10 w-15 "
              />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-gray-900 whitespace-no-wrap">{room?.title}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{room?.location}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">${room?.price}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {format(new Date(room?.from), "P")}
        </p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {format(new Date(room?.to), "P")}
        </p>
      </td>
      {/* delete button  */}
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <button
          onClick={() => setIsOpen(true)}
          className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
          ></span>
          <span className="relative">Delete</span>
        </button>
        {/* Delete modal */}
        <DeleteModal
          isOpen={isOpen}
          closeModal={handleClose}
          handleDelete={handleDelete}
          id={room?._id}
        />
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <button
          onClick={() => setOpen(true)}
          className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
          ></span>
          <span className="relative">Update</span>
        </button>
        {/* Update Modal */}
        <RoomUpdateModal
          setClose={setClose}
          open={open}
          handleUpdate={handleUpdate}
          room={room}
          formsValue={formsValue}
        />
      </td>
    </tr>
  );
};

RoomDataRow.propTypes = {
  room: PropTypes.object,
  refetch: PropTypes.func,
  index: PropTypes.number,
  handleDelete: PropTypes.func,
};

export default RoomDataRow;
