import { FaUserTie } from "react-icons/fa";
import HostModal from "../../../HostModal/HostModal";
import { useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const BecomeHost = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const handleHostReq = async () => {
    const hostData = {
      email: user?.email,
      status: "requested",
    };

    try {
      const { data } = await axiosSecure.put("/user", hostData);
      console.log(data, "host request response");

      if (data.modifiedCount > 0) {
        console.log(data);
        closeModal();
        toast.success("Host request sent successfully");
      } else {
        // shwo toast according to response
      }
    } catch (err) {
      console.log(err);
    } finally {
      closeModal();
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center px-4 py-2 my-5  transition-colors duration-300 transform  hover:bg-gray-300   hover:text-gray-700`}
      >
        <FaUserTie className="w-5 h-5" />
        <span className="mx-4 font-medium"> Become Host </span>
      </button>

      {/* host modal   props: { ,  ,} */}
      <HostModal
        closeModal={closeModal}
        isOpen={isOpen}
        handleHostReq={handleHostReq}
      />
    </div>
  );
};

export default BecomeHost;
