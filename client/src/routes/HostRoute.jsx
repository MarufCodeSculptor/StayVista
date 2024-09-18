import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import useRole from "../hooks/useRole";
import PropTypes from "prop-types";

const HostRoute = ({ children }) => {
  const { role, isLoading } = useRole();
  const condition = role === "host";
  if (isLoading) return <LoadingSpinner />;
  if (!condition) return <Navigate to={"/dashboard"}></Navigate>;
  return <> {children} </>;
};

HostRoute.propTypes = {
  children: PropTypes.element.isRequired,
};
export default HostRoute;
