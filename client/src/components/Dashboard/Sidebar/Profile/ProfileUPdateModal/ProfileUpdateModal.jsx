import {
  Dialog,
  Transition,
  DialogTitle,
  TransitionChild,
  DialogPanel,
} from "@headlessui/react";
import PropTypes from "prop-types";
import { Fragment, useState } from "react";

export default function ProfileUpdateModal({
  isOpen,
  handleClose,
  handleSubmit,
  user,
}) {
  const [imagePreview, setImagePreview] = useState(user?.photoURL);
  const [imageTitle, setImageTitle] = useState("_Select Image");

  const handleImage = (image) => {
    setImagePreview(URL.createObjectURL(image.target.files[0]));
    setImageTitle(image.target.files[0].name);
  };


  console.log(user,'the user');
  

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle className="text-2xl font-medium leading-6 text-gray-900 text-center mb-10 capitalize ">
                  Update Your Profile
                </DialogTitle>

                {/*  a from will aplied here  */}

                <form onSubmit={handleSubmit}>
                  {/* image upload container */}
                  <div className="w-full  min-h-32 rounded-lg flex items-center justify-center">
                    {imagePreview && (
                      <img className="w-64" src={imagePreview} alt="" />
                    )}
                  </div>
                  <div className=" p-4 bg-white w-full  m-auto rounded-lg flex items-center justify-center">
                    <div className="px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg w-96">
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

                  <div className="space-y-1 text-sm">
                    <label htmlFor="title" className="block text-gray-600">
                      Name
                    </label>
                    <input
                      className="w-96 px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
                      name="name"
                      id="name"
                      type="text"
                      defaultValue={user?.displayName}
                      placeholder="name"
                      required
                    />
                  </div>

                  <div className="my-5 ">
                    <button className="px-3 py-2 bg-blue-500 text-white rounded-lg ">
                      submit
                    </button>
                  </div>
                </form>

                <div className="mt-4 "></div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

ProfileUpdateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};
