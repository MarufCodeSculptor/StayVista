import LoadingSpinner from "../components/Shared/LoadingSpinner";
import useRole from "../hooks/useRole";
import PrivateRoute from "./PrivateRoute";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const AdminRoute = ({ children }) => {
  const { role, isLoading } = useRole();
 

  if (isLoading) return <LoadingSpinner />;
  if (role !== "admin") return <Navigate to={"/dashboard"}></Navigate>;
  if (role === "admin") {
    return <PrivateRoute>{children}</PrivateRoute>;
  }
};

AdminRoute.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AdminRoute;
