import { Helmet } from "react-helmet-async";
import Categories from "../../components/Categories/Categories";
import Rooms from "../../components/Home/Rooms";
import useRole from "../../hooks/useRole";

const Home = () => {
  const { role, isLoading, error, refetch } = useRole();
  console.log(role);

  return (
    <div>
      <Helmet>
        <title>StayVista | Vacation Homes & Condo Rentals</title>
      </Helmet>
      {/* Categories section  */}
      <Categories />
      {/* Rooms section */}
      <Rooms />
    </div>
  );
};

export default Home;
