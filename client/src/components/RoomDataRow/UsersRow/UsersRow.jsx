import PropTypes from "prop-types";
import { useState } from "react";
import UpdateUserModal from "../../Modal/UpdateUserModal/UpdateUserModal";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";



const UserDataRow = ({ user, refetch, index }) => {


  const { user: logedUser, laoding } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };
    const axiosSecure = useAxiosSecure();
    const { mutateAsync } = useMutation({
      anabled: !laoding,
      mutationKey: ["update-role", logedUser],
      mutationFn: async (userData) => {
        const { data } = await axiosSecure.put(
          `/user-role/${logedUser?.email}`,
          userData
        );
        return data;
      },

      onSuccess: async (data) => {
        console.log(data);
        toast.success("successfully updated users data");
      },
    });

  const modalHandler = async (selected) => {
    const updatedUserData = {
      email: user.email,
      role: selected,
      status: "Verified",
    };
    if(user.email === logedUser.email) return toast.error('Cannot procied')
    if (user.status === "Verified" && user.role === 'guest')return toast.error('Cannot process: user did not request');
    
      try {
        // call muted async with updateuser data
        await mutateAsync(updatedUserData);
        setIsOpen(false);
        refetch();
      } catch (err) {
        console.log(err);
      }
  };
  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{index + 1}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{user?.email}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{user?.role}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {user?.status ? (
          <p
            className={`${
              user.status === "Verified" ? "text-green-500" : "text-yellow-500"
            } whitespace-no-wrap`}
          >
            {user.status}
          </p>
        ) : (
          <p className="text-red-500 whitespace-no-wrap">Unavailable</p>
        )}
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <button
          onClick={() => setIsOpen(true)}
          className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
          ></span>
          <span className="relative">Update Role</span>
        </button>
        {/* Update User Modal */}
        <UpdateUserModal
          setIsOpen={setIsOpen}
          closeModal={closeModal}
          isOpen={isOpen}
          user={user}
          modalHandler={modalHandler}
        />
      </td>
    </tr>
  );
};

UserDataRow.propTypes = {
  user: PropTypes.object,
  refetch: PropTypes.func,
  index: PropTypes.number,
};

export default UserDataRow;
