import { NavLink } from 'react-router';
import Link from './Link';
import { useContext } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import logo from '../../assets/logo.png';
import Notification from './Notification';

const Navbar = () => {
  const { user, handleLogout } = useContext(AuthContext);

  const links = (
    <ul className="flex flex-col xl:flex-row gap-5 xl:items-center">
      <Link link="/" title="HOME" />
      <Link link="/materials" title="MATERIALS" />
      <Link link="/coverpage" title="COVER PAGE" />
      <Link link="/leaderboard" title="LEADERBOARD" />
    </ul>
  );

  return (
    <nav className="px-5 h-16 xl:px-10 fixed top-0 w-full z-50 backdrop-blur-xl border-b border-gray-800 flex items-center">
      <div className="w-7xl mx-auto flex justify-between items-center text-white">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} className="h-6 w-6" />
          <h1 className="font-bold">Class Vault</h1>
        </div>

        {/* Links */}
        <div className="hidden xl:flex gap-5">
          {links}
          {user && <Notification />}
        </div>

        {/* Sign in */}
        {!user && (
          <NavLink to="/signin">
            <button className="px-3 py-1 font-bold rounded-full bg-gradient-to-r from-pink-400 to-purple-500">
              Sign in
            </button>
          </NavLink>
        )}

        {/* Mobile Notification */}
        <div className="lg:hidden">{user && <Notification />}</div>

        {/* Profile Dropdown */}
        {user && (
          <div className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              className="h-10 w-10 rounded-full border overflow-hidden"
            >
              <img
                src={
                  typeof user?.photoUrl === 'string'
                    ? user.photoUrl
                    : '/default.png'
                }
                className="h-full w-full object-cover"
              />
            </div>

            <ul className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-40">
              <li>
                <NavLink to="/profile">Profile</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard">Dashboard</NavLink>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
