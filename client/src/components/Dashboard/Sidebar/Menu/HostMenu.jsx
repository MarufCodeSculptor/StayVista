import MenuItem from "./MenuItem";
import { BsFillHouseAddFill, BsGraphUp } from "react-icons/bs";
import { MdHomeWork } from "react-icons/md";


const HostMenu = () => {
    return (
        <div>
              <div>
              {/* Statistics */}
                <MenuItem
                  label={"Statistics"}
                  address={"/dashboard"}
                  icon={BsGraphUp}
                />
                {/* Add Room */}
                <MenuItem
                  label={"Add Rooms"}
                  address={"add-room"}
                  icon={BsFillHouseAddFill}
                />
                {/* My Listings */}
                <MenuItem
                  label={"My-Listing"}
                  address={"my-listings"}
                  icon={MdHomeWork}
                />
              </div>
        </div>
    );
};

export default HostMenu;