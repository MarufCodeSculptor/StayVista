import PropTypes, { object } from "prop-types";
import { format } from "date-fns";
import DeleteModal from "../Modal/DeleteModal";

import RoomUpdateModal from "../Modal/RoomUpdateModal/RoomUpdateModal";
import LoadingSpinner from "../Shared/LoadingSpinner";

const RoomDataRow = ({
  room,
  index,
  handleDelete,
  handleUpdate,
  updateModalConfig,
  deltedModalConfig,
  inProgress
}) => {



 

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
          onClick={() => deltedModalConfig.handle.setIsOpen(true)}
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
          isOpen={deltedModalConfig.isOpen}
          handleClose={deltedModalConfig.handle.handleClose}
          handleDelete={handleDelete}
          id={room?._id}
          inProgress={inProgress}
        />
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <button
          onClick={() => updateModalConfig.handle.setOpen(true)}
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
          setClose={updateModalConfig.handle.setClose}
          open={updateModalConfig.open}
          handleUpdate={handleUpdate}
          room={room}
          inProgress={inProgress}
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
  user: PropTypes.object,
  handleUpdate: PropTypes.func,
  imageLoading: PropTypes.bool,
  updateModalConfig: object,
  deltedModalConfig: object,
  inProgress:PropTypes.bool
};

export default RoomDataRow;
