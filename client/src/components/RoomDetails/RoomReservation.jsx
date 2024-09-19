import PropTypes from "prop-types";
import Button from "../Shared/Button/Button";
import { DateRange } from "react-date-range";
import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import RoomReserveModal from "../Modal/RoomReserveModal/RoomReserveModal";
import useAuth from "../../hooks/useAuth";

const RoomReservation = ({ room }) => {
  const theDate = {
    startDate: new Date(room.from),
    endDate: new Date(room.to),
    key: "selection",
  };
  const [state, setState] = useState(theDate);
  const { user, loading } = useAuth();
  console.log(user, "the user ");

  const totalDays = parseInt(
    differenceInCalendarDays(new Date(room.to), new Date(room.from)) + 1
  );
  const totalPrice = totalDays * room.price;
  // { closeModal, isOpen, bookingInfo }
  const [isOpen, setIsOpen] = useState(false);
  const bookingInfo = {
    ...room,
    guest: {
      name: user?.displayName,
      email: user?.email,
    },
    price: totalPrice,
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleReserve = (booking) => {
    console.log("handle seserver is working ");
  };

  return (
    <div className="rounded-xl border-[1px] border-neutral-200 overflow-hidden bg-white">
      <div className="flex items-center gap-1 p-4">
        <div className="text-2xl font-semibold">$ {room?.price}</div>
        <div className="font-light text-neutral-600">night</div>
      </div>
      <hr />
      <div className="flex justify-center">
        {/* Calender */}
        <DateRange
          showDateDisplay={false}
          rangeColors={["#F6536D"]}
          onChange={() => setState(theDate)}
          moveRangeOnFirstSelection={false}
          editableDateInputs={false}
          ranges={[state]}
        />
      </div>
      <hr />
      <div className="p-4">
        <Button onClick={() => setIsOpen(true)} label={"Reserve"} />
        {/*   a modal wil appy here :  */}

        {!loading && (
          <RoomReserveModal
            closeModal={closeModal}
            isOpen={isOpen}
            bookingInfo={bookingInfo}
            handleReserve={handleReserve}
          />
        )}
      </div>
      <hr />
      <div className="p-4 flex items-center justify-between font-semibold text-lg">
        <div>Total</div>
        <div>${totalPrice}</div>
      </div>
    </div>
  );
};

RoomReservation.propTypes = {
  room: PropTypes.object,
};

export default RoomReservation;
