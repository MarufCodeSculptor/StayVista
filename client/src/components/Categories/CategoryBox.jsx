import PropTypes from "prop-types";
import queryString from "query-string";
import { useNavigate, useSearchParams } from "react-router-dom";

const CategoryBox = ({ label, icon: Icon }) => {
  const [params, setParams] = useSearchParams();
  const category = params.get("category");
  const classCondition = label === category;

  const navigate = useNavigate();
  const handleCatagory = () => {
    let currentQuery = {
      category: label,
    };

    const url = queryString.stringifyUrl({
      url: "/",
      query: currentQuery,
    });
    navigate(url);
    console.log(url);
  };

  return (
    <div
      onClick={handleCatagory}
      className={`flex flex-col items-center justify-center gap-2 p-3 border-b-4 ${classCondition && 'border-gray-900'} hover:text-neutral-800 transition cursor-pointer`}
    >
      <Icon size={26} />
      <div className="text-sm font-medium">{label}</div>
    </div>
  );
};

CategoryBox.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};

export default CategoryBox;
