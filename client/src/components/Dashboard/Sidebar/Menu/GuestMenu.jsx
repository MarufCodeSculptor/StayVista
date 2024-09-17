import { MdHomeWork } from "react-icons/md";
import MenuItem from "./MenuItem";
import { BsBookmarks, BsEnvelope, BsGear, BsHeart } from "react-icons/bs";

const GuestMenu = () => {
  return (
    <div>
      {/* My Listings */}
        <MenuItem
            label={"My Listings"}
            address={"my-listings"}
            icon={MdHomeWork}
        />

        {/* My Bookings */}
        <MenuItem
            label={"My Bookings"}
            address={"my-bookings"}
            icon={BsBookmarks}
        />

        {/* My Messages */}
        <MenuItem
            label={"My Messages"}
            address={"my-messages"}
            icon={BsEnvelope}
        />

        {/* My Favorites */}
        <MenuItem
            label={"My Favorites"}
            address={"my-favorites"}
            icon={BsHeart}
        />

      {/* My Settings */}
      <MenuItem label={"My Settings"} address={"my-settings"} icon={BsGear} />
    </div>
  );
};

export default GuestMenu;
