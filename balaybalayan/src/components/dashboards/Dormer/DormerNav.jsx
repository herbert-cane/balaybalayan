import { FaHome, FaUser, FaBed, FaReceipt, FaBook } from 'react-icons/fa';

const DormerNav = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/dormer/dashboard"><FaHome /> Dashboard</Link>
        </li>
        <li>
          <Link to="/dormer/account-info"><FaUser /> Account Info</Link>
        </li>
        <li>
          <Link to="/dormer/my-dorm"><FaBed /> My Dorm</Link>
        </li>
        <li>
          <Link to="/dormer/payment-history"><FaReceipt /> Payment History</Link>
        </li>
        <li>
          <Link to="/dormer/rules"><FaBook /> Rules and Regulations</Link>
        </li>
      </ul>
    </nav>
  );
}

export default DormerNav;
