import { Menu, Popover } from "@headlessui/react";
import React, { useState } from "react";
import { MdOutlineClose, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiCurrencyFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { IoIosMenu } from "react-icons/io";
import useStore from "../store/index";
import ThemeSwitch from "../components/themeswitch";
// import TransitionWrapper from "./wrappers/transition-wrapper";

const links = [
  { label: "Dashboard", link: "/overview" },
  { label: "Transactions", link: "/transactions" },
  { label: "Accounts", link: "/accounts" },
  { label: "Settings", link: "/settings" },
  { label: "Budget", link: "/budget" },

];

const UserMenu = () => {
  const { user, setCredentails } = useStore((state) => state);
  const navigate = useNavigate();

  const handleSingout = () => {
    localStorage.removeItem("user");
    
    window.location.reload(); // Force reload
  };

  return (
    <Menu as='div' className='relative  z-50'>
      <div>
        <Menu.Button className=''>
          <div className='flex items-center gap-2'>
            <div className='w-10 2xl:w-12 h-10 2xl:h-12 rounded-full text-white bg-black cursor-pointer flex items-center justify-center'>
              <p className='text-2xl font-bold'>{user?.user.firstname?.charAt(0).toUpperCase()}</p>
            </div>
            <div className='hidden md:block text-left'>
              <p className='text-lg font-medium text-black dark:text-gray-400'>
                {user?.firstname}
              </p>
              <span className='text-sm text-gray-700 dark:text-gray-500'>
                {user?.email}
              </span>
            </div>
            <MdOutlineKeyboardArrowDown className='hidden md:block text-2xl text-gray-600 dark:text-gray-300 cursor-pointer' />
          </div>
        </Menu.Button>
      </div>
     
        <Menu.Items className='absolute z-50 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-slate-800  shadow-lg ring-1 ring-black/5 focus:outline-none'>
          <div className='px-1 py-1 '>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleSingout}
                  className={`${
                    active
                      ? "bg-violet-500/10 text-gray-900 dark:text-white"
                      : "text-gray-900 dark:text-gray-500"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Sign Out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
   
    </Menu>
  );
};

const MobileSidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className=''>
      <Popover className=''>
        {({ open }) => (
          <>
            <Popover.Button
              className={`
               flex md:hidden items-center rounded-md font-medium focus:outline-none text-gray-600 dark:text-gray-400`}
            >
              {open ? <MdOutlineClose size={26} /> : <IoIosMenu size={26} />}
            </Popover.Button>
         
              <Popover.Panel className='absolute left-1/2 z-50 bg-white dark:bg-slate-800 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 py-6'>
                <div className='flex flex-col space-y-2'>
                  {links.map(({ label, link }, index) => (
                    <Link to={link} key={index}>
                      <Popover.Button
                        className={`${
                          link === path
                            ? "bg-black dark:bg-slate-900 text-white"
                            : "text-gray-700 dark:text-gray-500"
                        } w-1/2 px-6 py-2 rounded-full text-left`}
                      >
                        {label}
                      </Popover.Button>
                    </Link>
                  ))}

                  <div className='flex items-center justify-between py-6 px-4'>
                    <Popover.Button>
                      <ThemeSwitch />
                    </Popover.Button>
                    <UserMenu />
                  </div>
                </div>
              </Popover.Panel>
       
          </>
        )}
      </Popover>
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className='w-full flex items-center justify-between py-6'>
      <Link to='/'>
        <div className='flex items-center gap-2 cursor-pointer'>
          <div className='w-10 md:w-12 h-10 md:h-12 flex items-center justify-center bg-black rounded-xl'>
            <RiCurrencyFill className='text-white text-3xl hover:animate-spin' />
          </div>
          <span className='text-xl font-bold text-black dark:text-white'>
          TrackMyFunds
          </span>
        </div>
      </Link>

      <div className='hidden md:flex items-center gap-4'>
        {links.map(({ label, link }, index) => (
          <div
            key={index}
            className={`${
              link === path
                ? "bg-black dark:bg-slate-800 text-white"
                : "text-gray-700 dark:text-gray-500"
            } px-6 py-2 rounded-full`}
          >
            <Link to={link}>{label}</Link>
          </div>
        ))}
      </div>

      <div className='hidden md:flex items-center gap-10 2xl:gap-20'>
        <ThemeSwitch />

        <UserMenu />
      </div>

      <div className='flex md:hidden'>
        <MobileSidebar />
      </div>
    </div>
  );
};

export default Navbar;