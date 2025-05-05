import React, { useEffect, useState } from "react";
import { FaBtc, FaCcMastercard, FaPaypal } from "react-icons/fa";
import { RiVisaLine } from "react-icons/ri";
import Title from "./title";
import api from "../libs/apiCall";
import { MdVerifiedUser } from "react-icons/md";
import { IoGitCompareSharp } from "react-icons/io5";
import { toast } from "sonner";
import useStore from "../store/index";

const ICONS = {
  crypto: (
    <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full">
      <FaBtc size={26} />
    </div>
  ),
  "visa debit card": (
    <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full">
      <RiVisaLine size={26} />
    </div>
  ),
  cash: (
    <div className="w-12 h-12 bg-rose-600 text-white flex items-center justify-center rounded-full">
      <IoGitCompareSharp size={26} />
    </div>
  ),
  gpay: (
    <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full">
      <FaPaypal size={26} />
    </div>
  ),
};

const Accounts = () => {
  const { user } = useStore((state) => state);
  const [data, setData] = useState([]);
  const fetchAccounts = async () => {
    try {
      const userId = user?.user?.id;
      const { data: res } = await api.get(`/account/${userId}`);
      setData(res?.data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message );
      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } 
  };
  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="mt-20 md:mt-0 py-5 md:py-20 md:w-1/3">
      <Title title="Accounts" />
      <span className="text-sm text-gray-600 dark:text-gray-500">
        View all your accounts
      </span>

        <div className="w-full flex flex-col gap-4">
                 {data?.map((acc, index) => (
                   <div
                     key={index}
                     className="w-full h-auto flex gap-4 bg-gray-50 dark:bg-slate-800 p-3 rounded shadow"
                   >
                     <div className="">
                       {ICONS[acc?.account_name?.toLowerCase()]}
                     </div>
                     <div className="space-y-2 w-full">
                       <div className="flex ">
                         <div className="flex items-start justify-items-start text-left">
                           <p className="text-black dark:text-white  text-2xl font-bold">
                             {acc?.account_name}
                           </p>
                           <MdVerifiedUser
                             size={26}
                             className="text-emerald-600 ml-1"
                           />
                         </div>
                       </div>
                       <div className="text-gray-700 dark:text-gray-300">
                         <p>
                           <span className="font-semibold">Account Number:</span>{" "}
                           {acc?.account_number}
                         </p>
                         <p>
                           <span className="font-semibold">Balance:</span> $
                           {acc?.account_balance}
                         </p>
                       
                      </div>
                     </div>
                   </div>
                 ))}
               </div>
            
    </div>
  );
};

export default Accounts;
