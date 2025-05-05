import React, { useEffect, useState } from "react";
import useStore from "../store";
import { FaBtc, FaPaypal } from "react-icons/fa";
import { RiVisaLine } from "react-icons/ri";
import Loading from "../components/Loading";
import { MdAdd, MdVerifiedUser } from "react-icons/md";
import Title from "../components/Title";
import { IoGitCompareSharp } from "react-icons/io5";
import { toast } from "sonner";
import api from "../libs/apiCall";
import AddMoney from '../components/AddMoney'
import { Menu } from "@headlessui/react";
import { BsCashCoin } from "react-icons/bs";
import { FaGooglePay } from "react-icons/fa";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
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
      <BsCashCoin size={26} />
    </div>
  ),
  gpay: (
    <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full">
      <FaGooglePay size={26} />
    </div>
  ),
};

const AccountPage = () => {
  const [selectedAccount, setSelectedAccount] = useState({
    name: "",
    amount: "",
    account_number: "",
  });
  const { user } = useStore((state) => state);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTopup, setIsOpenTopup] = useState(false);
  const [isOpenTransfer, setIsOpenTransfer] = useState(false);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchAccounts = async () => {
    try {
      const userId = user?.user?.id;
      const { data: res } = await api.get(`/account/${userId}`);
      setData(res?.data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async (e) => {
    e.preventDefault();
    const trimmedAccount = {
      ...selectedAccount,
      account_name: selectedAccount.name.trim(),
      account_number: selectedAccount.account_number.trim(),
      amount: selectedAccount.amount,
    };

    if (
      !trimmedAccount.account_name ||
      !trimmedAccount.amount ||
      !trimmedAccount.account_number
    ) {
      toast.error("All fields are required!");
      return;
    }

    if (trimmedAccount.ame === "") {
      toast.error("Account name cannot be empty!");
      return;
    }

    try {
      const { data: res } = await api.post(`/account/create`, trimmedAccount);
      if (res?.status === "success") {
        toast.success(res?.message);
        fetchAccounts();
        setIsOpen(false);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchAccounts();
  }, []);


  const handleOpenAddMoney = (el) => {
    setSelectedAccount(el?.id);
    setIsOpenTopup(true);
};

const handleTransferMoney = (el) => {
    setSelectedAccount(el?.id);
    setIsOpenTransfer(true);
};


  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <div className="w-full py-10">
        <div className="flex items-center justify-between">
          <Title title="Accounts Information" />
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="py-1.5 px-2 rounded bg-black dark:bg-violet-600 text-white dark:text-white flex items-center justify-center"
            >
              <MdAdd size={22} />
              <span className="">Add</span>
            </button>
          </div>
        </div>

        {data?.length == 0 ? (
          <>
            <div className="w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-700 text-lg">
              <span>No Account Found</span>
            </div>
          </>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 2xl:gridd-cols-4 py-10 gap-6">
            {data?.map((acc, index) => (
              <div
                key={index}
                className="w-full h-auto flex gap-4 bg-gray-50 dark:bg-slate-800 p-3 rounded shadow"
              >
                <div className="">
                  {ICONS[acc?.account_name?.toLowerCase()]}
                </div>
                <div className="space-y-2 w-full">
                  
                    <div className="flex items-center justify-between text-left">
                     <div className="flex align-middle items-center w-full justify-between">
                     <div className="flex ">
                      <p className="text-black dark:text-white  text-2xl font-bold">
                        {acc?.account_name}
                      </p>
                      <MdVerifiedUser
                        size={26}
                        className="text-emerald-600 ml-1 mt-2"
                      />
</div>
<div>

<Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
        <EllipsisVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </Menu.Button>
      <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="p-1">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => handleOpenAddMoney(acc)}
                className={`${
                  active
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-200"
                } group flex w-full items-center rounded-md px-3 py-2 text-sm`}
              >
                Add Money
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
</div>
                    </div>
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    <p>
                      <span className="font-semibold">Account Number:</span>{" "}
                      {acc?.account_number}
                    </p>
                    <p>
                      <span className="font-semibold">Balance:</span> ₹
                      {acc?.account_balance}
                    </p>
                    <p>
                      <span className="font-semibold">Created At:</span>{" "}
                      {new Date(acc?.createdat).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Updated At:</span>{" "}
                      {new Date(acc?.updatedat).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4 text-black dark:text-white">
                Create Account
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Account Name
                  </label>
                  <select
                    value={selectedAccount.name}
                    onChange={(e) =>
                      setSelectedAccount({
                        ...selectedAccount,
                        name: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Account Type</option>
                    <option value="crypto">Crypto</option>
                    <option value="visa debit card">Visa Debit Card</option>
                    <option value="cash">Cash</option>
                    <option value="gpay">GPay</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={selectedAccount.amount}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    onChange={(e) =>
                      setSelectedAccount({
                        ...selectedAccount,
                        amount: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={selectedAccount.account_number}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    onChange={(e) =>
                      setSelectedAccount({
                        ...selectedAccount,
                        account_number: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="py-2 px-4 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={createAccount}
                  className="py-2 px-4 bg-blue-600 text-white rounded"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
{isOpenTopup ? <><AddMoney
      isOpen={isOpenTopup}
      setIsOpen={setIsOpenTopup}
      id={selectedAccount}
      refetch={fetchAccounts}
      key={new Date().getTime()+1}
      /> </> :<> </>

}
      
    </>
  );
};

export default AccountPage;
