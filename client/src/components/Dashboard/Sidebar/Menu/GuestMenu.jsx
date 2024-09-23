import MenuItem from "./MenuItem";
import { BsBookmarks } from "react-icons/bs";

const GuestMenu = () => {
  return (
    <div>
      {/* My Bookings */}
      <MenuItem
        label={"My Bookings"}
        address={"my-bookings"}
        icon={BsBookmarks}
      />
    </div>
  );
};

export default GuestMenu;
