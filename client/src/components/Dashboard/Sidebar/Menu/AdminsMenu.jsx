import { FaUser } from "react-icons/fa";
import MenuItem from "./MenuItem";
import { BsBookmarks, BsGear } from "react-icons/bs";

const AdminsMenu = () => {
  return (
    <div>
      <MenuItem
        label={"Admin Statictics"}
        address={"admin-statictics"}
        icon={BsGear}
      />
      

      {/* My Bookings */}
      <MenuItem
        label={"All Bookings"}
        address={"all-bookings"}
        icon={BsBookmarks}
      />

      <MenuItem label={"Manger User"} address={"manage-user"} icon={FaUser} />
    </div>
  );
};

export default AdminsMenu;
