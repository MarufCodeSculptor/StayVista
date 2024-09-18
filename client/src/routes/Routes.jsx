import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Home from "../pages/Home/Home";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import RoomDetails from "../pages/RoomDetails/RoomDetails";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../layouts/Dashboard";
import Statictics from "../pages/Dashboard/Common/Statictics";
import Addrooms from "../pages/Dashboard/Host/Addrooms";
import MyListings from "../pages/Dashboard/Host/MyListings";
import Profile from "../pages/Dashboard/Profile/Profile";
import ManageUsers from "../pages/Dashboard/Admin/ManageUser/ManageUser";
import AdminRoute from "./AdminRoute";
import AllBookins from "../pages/Dashboard/AllBookings/AllBookins";
import HostRoute from "./HostRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/room/:id",
        element: (
          <PrivateRoute>
            <RoomDetails />
          </PrivateRoute>
        ),
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL + "/room/" + params.id}`),
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      // normal users menu
      {
        index: true,
        element: (
          <PrivateRoute>
            <Statictics />
          </PrivateRoute>
        ),
      },

      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      // host mensus
      {
        path: "add-room",
        element: (
          <PrivateRoute>
            <HostRoute>
              <Addrooms />
            </HostRoute>
          </PrivateRoute>
        ),
      },

      {
        path: "my-listings",
        element: (
          <PrivateRoute>
         <HostRoute>   <MyListings /></HostRoute>
          </PrivateRoute>
        ),
      },
      // admins routes
      {
        path: "manage-user",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "all-bookings",
        element: (
          <AdminRoute>
            <AllBookins />
          </AdminRoute>
        ),
      },
    ],
  },
]);
