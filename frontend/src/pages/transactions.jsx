import React from "react";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Loading from "../components/Loading";
import api from "../libs/apiCall";
import { MdAdd } from "react-icons/md";
import { IoCheckmarkDoneCircle, IoSearchOutline } from "react-icons/io5";
import { CiExport } from "react-icons/ci";
import DateRange from "../components/DateRange";
import Title from "../components/Title";
import { RiProgress3Line } from "react-icons/ri";
import { TiWarning } from "react-icons/ti";
import { exportToExcel } from "react-json-to-excel";
import useStore from '../store/index'
import AddTransaction from "../components/add-transactions";
import TransactionDetails from "../components/details";
import { IoTrash } from "react-icons/io5"; 

const Transactions = () => {

  const { user } = useStore((state) => state);

  const token =user?.user?.token

  const [searchParams, setSearchParams] = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");
  const startDate = searchParams.get("df") || "";
  const endDate = searchParams.get("dt") || "";

  const handleViewTransaction = (el) => {
    setSelected(el);
    setIsOpenView(true);
  };

  const fetchTransactions = async () => {
    try {
      const URL = `/transaction?df=${startDate}&dt=${endDate}&s=${search}`;
      // console.log("url is", URL)
      const { data: res } = await api.get(URL);
      setData(res?.data);
      // console.log(res?.data);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Something unexpected happened. Try again later."
      );
      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
  
    setSearchParams({
      df: startDate,
      dt: endDate,

    });
    
  
    setIsLoading(true);
    await fetchTransactions();
  };
  
  useEffect(() => {
    setIsLoading(true);
    fetchTransactions();
  }, [startDate, endDate]);

  if (isLoading) return <Loading />;


  const handleDeleteTransaction = async (transactionId) => {
   
    try {
      await api.delete(`/transaction/${transactionId}`);
      toast.success("Transaction deleted successfully");
      fetchTransactions();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error deleting the transaction"
      );
    }
  };



  return (
    <>
      <div className="w-full py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Title title="Transactions Activity" />

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <DateRange />

            <form onSubmit={(e) => handleSearch(e)}>
              <div className="w-full flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-2">
                <IoSearchOutline className="text-xl text-gray-600 dark:text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search now..."
                  className="outline-none group bg-transparent text-gray-700 dark:text-gray-400 placeholder:text-gray-600"
                />
              </div>
            </form>

            <button
              onClick={() => setIsOpen(true)}
              className="py-1.5 px-2 rounded text-white bg-black dark:bg-violet-800 flex items-center justify-center gap-2"
            >
              <MdAdd size={22} />
              <span>Pay</span>
            </button>
            <button
              onClick={() =>
                exportToExcel(data, `Transactions ${startDate}-${endDate}`)
              }
              className="flex items-center gap-2 text-black dark:text-gray-300"
            >
              Export <CiExport size={24} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mt-5">
          {data?.length === 0 ? (
            <div className="w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-700 text-lg">
              <span>No Transaction History</span>
            </div>
          ) : (
            <>
              <table className="w-full ">
                <thead className="w-full border-b border-gray-300 dark:border-gray-700">
                  <tr className="w-full text-black dark:text-gray-400 text-left">
                    <th className="py-2">Date</th>
                    <th className="py-2 px-2">Description</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2">Source</th>
                    <th className="py-2 px-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr
                      key={index}
                      className="w-full border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                      <td className="py-4 ">
                        <p className="w-24 md:w-auto">
                          {new Date(item.createdat).toDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex flex-col w-56 md:w-auto">
                          <p className="text-base 2xl:text-lg text-black dark:text-gray-400 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          {item.status === "Pending" && (
                            <RiProgress3Line
                              className="text-amber-600"
                              size={24}
                            />
                          )}
                          {item.status === "Completed" && (
                            <IoCheckmarkDoneCircle
                              className="text-emerald-600"
                              size={24}
                            />
                          )}

                          {item.status == "Rejected" && (
                            <TiWarning className="text-red-600" size={24} />
                          )}
                          <span>{item?.status} </span>
                        </div>
                      </td>
                      <td className="py-4 px-2">{item?.source}</td>
                      <td className="py-4 text-black dark:text-gray-400 text-base font-medium">
                        <span
                          className={`${
                            item?.type === "income"
                              ? "text-emerald-600"
                              : "text-red-600"
                          } text-lg font-bold mgl-1`}
                        >
                          {item?.type === "income" ? "+" : "-"}
                        </span>
                        {(item?.amount)}
                      </td>
                      <td className="py-4 px-2">
                        <button
                          onClick={() => handleViewTransaction(item)}
                          className="outline-none text-violet-600 hover:underline"
                        >
                          View
                        </button>

                        <button
                        onClick={() => handleDeleteTransaction(item.id)}
                        className="outline-none text-red-600 ml-4"
                      >
                        <IoTrash size={24} />
                      </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {isOpen && (
  <div className="absolute w-[100vw] inset-0 bg-black bg-opacity-40 z-50 pl-[70vw] flex items-center justify-center">
    <AddTransaction
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      refetch={fetchTransactions}
      key={new Date().getTime()}
    />
  </div>
)}


{isOpenView && selected && (
  <TransactionDetails
    data={selected}
    onClose={() => setIsOpenView(false)}
  />
)}




    </>
  );
};

export default Transactions;
