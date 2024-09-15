import PropTypes from "prop-types";

const TableHead = ({ children }) => {
  return (
    <th
      scope="col"
      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-bold"
    >
      {children}
    </th>
  );
};

TableHead.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TableHead;
