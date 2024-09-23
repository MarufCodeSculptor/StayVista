import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import "./style.css";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CheckoutForm = ({ closeModal, bookingInfo }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const stripe = useStripe();
  const [clientSecret, setClientSecret] = useState({});
  const elements = useElements();
  const [cardErr, setCardErr] = useState("");
  const [proccessing, setProccessing] = useState(false);
  const navigate = useNavigate();

  // gettin payment intent from the backend
  const { mutateAsync: getpaymentIntent } = useMutation({
    mutationKey: ["payment-intent"],
    mutationFn: async (price) => {
      const { data } = await axiosSecure.post("/payment-intent", { price });
      return data;
    },
    onSuccess: async (data) => {
      setClientSecret(data);
    },
  });
  //  posting bookings data to database  = >
  const { mutateAsync: postBooking } = useMutation({
    mutationKey: ["posting-booking-data"],
    mutationFn: async (bookedDetails) => {
      const { data } = await axiosSecure.post("/booking", bookedDetails);
      return data;
    },
    onSuccess: async (data) => {
      console.log(data, "booking data posted");
      toast.success("Successfully booked");
      navigate('/dashboard/my-bookings')
    },
  });

  useEffect(() => {
    if (bookingInfo?.price && bookingInfo?.price > 0) {
      getpaymentIntent(bookingInfo.price);
    }
  }, [bookingInfo.price, getpaymentIntent]);

  const handleSubmit = async (form) => {
    setProccessing(true);

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (card == null) {
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      setCardErr(error?.message);
      return;
    } else {
      console.log("[PaymentMethod]", paymentMethod, "from success");
    }

    const { error: paymentError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret.clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email,
            name: user.displayName,
          },
        },
      });

    if (paymentError) {
      console.log(paymentError, "the payment error");
      setProccessing(false);
    }

    if (paymentIntent.status === "succeeded") {
      const { _id, ...rest } = { ...bookingInfo };
      // create payment iinfo object
      const bookingDetails = {
        ...rest,
        transactionId: paymentIntent.id,
        date: new Date(),
        roomId: _id,
      };
      // posting bookingsData to the server
      await postBooking(bookingDetails);
      // save payment info into the bookiings collections

      //  change room status into the rooms collections  by patch methos
    }
  };

  return (
    <>
      <h3 className="text-sm text-red-500 text-center">{cardErr}</h3>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(event.target);
        }}
      >
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />

        <div className="flex mt-2 justify-around">
          <button
            disabled={!clientSecret || !stripe || proccessing}
            type="submit"
            className="inline-flex justify-center items-center gap-3   rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            Pay <span className="text-lg">{bookingInfo.price + "$"}</span>
          </button>
          <button
            onClick={closeModal}
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

CheckoutForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  bookingInfo: PropTypes.object.isRequired,
};

export default CheckoutForm;
