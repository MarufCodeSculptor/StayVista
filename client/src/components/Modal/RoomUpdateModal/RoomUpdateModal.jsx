import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { DateRange } from "react-date-range";
import { categories } from "../../Categories/CategoriesData";
import LoadingSpinner from "../../Shared/LoadingSpinner";

const RoomUpdateModal = ({ handleUpdate, setClose, open, room,inProgress }) => {
  // handling image  and dates stte and fucntions =>
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



  if(inProgress) return <LoadingSpinner/>

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full  transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Update Room Information
                </DialogTitle>

                <hr className="mt-8 " />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = {
                      form: e.target,
                      state,
                      id:room._id
                    };
                    handleUpdate(formData);
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="space-y-1 text-sm">
                        <label
                          htmlFor="location"
                          className="block text-gray-600"
                        >
                          Location
                        </label>
                        <input
                          className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
                          name="location"
                          id="location"
                          type="text"
                          placeholder="Location"
                          defaultValue={room.location}
                          required
                        />
                      </div>

                      <div className="space-y-1 text-sm">
                        <label
                          htmlFor="category"
                          className="block text-gray-600"
                        >
                          Category
                        </label>
                        <select
                          required
                          className="w-full px-4 py-3 border-rose-300 focus:outline-rose-500 rounded-md"
                          name="category"
                          defaultValue={room.category}
                        >
                          {categories.map((category) => (
                            <option value={category.label} key={category.label}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="location"
                          className="block text-gray-600"
                        >
                          Select Availability Range
                        </label>
                        {/* Calender */}
                        <DateRange
                          showDateDisplay={false}
                          rangeColors={["#F6536D"]}
                          editableDateInputs={true}
                          onChange={(item) => handleDates(item)}
                          moveRangeOnFirstSelection={false}
                          ranges={[state]}
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-1 text-sm">
                        <label htmlFor="title" className="block text-gray-600">
                          Title
                        </label>
                        <input
                          className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
                          name="title"
                          defaultValue={room.title}
                          id="title"
                          type="text"
                          placeholder="Title"
                          required
                        />
                      </div>
                      {/* image upload container */}
                      <div className="w-full  min-h-32 rounded-lg flex items-center justify-center">
                        {imagePreview && (
                          <img className="w-64" src={imagePreview} alt="" />
                        )}
                      </div>

                      <div className=" p-4 bg-white w-full  m-auto rounded-lg">
                        <div className="file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg">
                          <div className="flex flex-col w-max mx-auto text-center">
                            <label>
                              <input
                                onChange={handleImage}
                                className="text-sm cursor-pointer w-36 hidden"
                                type="file"
                                name="image"
                                id="image"
                                accept="image/*"
                                hidden
                              />
                              <div className="bg-rose-500 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-rose-500">
                                {(imageTitle &&
                                  imageTitle.length > 20 &&
                                  imageTitle.split(".")[0].slice(0, 20) +
                                    "." +
                                    imageTitle.split(".")[1]) ||
                                  imageTitle}
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between gap-2">
                        <div className="space-y-1 text-sm">
                          <label
                            htmlFor="price"
                            className="block text-gray-600"
                          >
                            Price
                          </label>
                          <input
                            className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
                            name="price"
                            id="price"
                            type="number"
                            placeholder="Price"
                            required
                            defaultValue={room.price}
                          />
                        </div>

                        <div className="space-y-1 text-sm">
                          <label
                            htmlFor="guest"
                            className="block text-gray-600"
                          >
                            Total guest
                          </label>
                          <input
                            className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
                            name="guests"
                            defaultValue={room.guests}
                            id="guest"
                            type="number"
                            placeholder="Total guest"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-between gap-2">
                        <div className="space-y-1 text-sm">
                          <label
                            htmlFor="bedrooms"
                            className="block text-gray-600"
                          >
                            Bedrooms
                          </label>
                          <input
                            className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
                            name="bedrooms"
                            id="bedrooms"
                            type="number"
                            placeholder="Bedrooms"
                            defaultValue={room.bedrooms}
                            required
                          />
                        </div>

                        <div className="space-y-1 text-sm">
                          <label
                            htmlFor="bathrooms"
                            className="block text-gray-600"
                          >
                            Bathrooms
                          </label>
                          <input
                            className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
                            name="bathrooms"
                            id="bathrooms"
                            defaultValue={room.bathrooms}
                            type="number"
                            placeholder="Bathrooms"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1 text-sm">
                        <label
                          htmlFor="description"
                          className="block text-gray-600"
                        >
                          Description
                        </label>

                        <textarea
                          id="description"
                          className="block rounded-md focus:rose-300 w-full h-32 px-4 py-3 text-gray-800  border border-rose-300 focus:outline-rose-500 "
                          name="description"
                          defaultValue={room.description}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="flex mt-2 justify-around">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={setClose}
                    >
                      Cencel
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

RoomUpdateModal.propTypes = {
  setClose: PropTypes.func,
  open: PropTypes.bool,
  handleUpdate: PropTypes.func.isRequired,
  formsValue: PropTypes.object,
  room: PropTypes.object,
  inProgress:PropTypes.bool,
};

export default RoomUpdateModal;
