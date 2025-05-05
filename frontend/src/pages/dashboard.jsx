import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import api from "../libs/apiCall";
import { toast } from "sonner";
import Info from "../components/info";
import Stats from "../components/stats";
import Chart from "../components/chart";
import DoughnutChart from "../components/doughnutChart";
import Transactions from "../components/transactions";
import Accounts from "../components/accounts";

const Dashboard = () => {

  const [data, setData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardStats = async () => {
    const URL = "/transaction/dashboard";
    try {
      const { data } = await api.get(URL);
      // console.log("Dashboard data:", data);
      setData(data);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Something unexpected happened. Try again later."
      );
  
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchDashboardStats();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <Loading />
      </div>
    );
  }
  




  return (
    <div className="px-0 md:px-5 2xl:px-20">
      <Info title="Dashboard" subTitle={"Monitor your financial activities"} />
      <Stats
        dt={{
          balance: data?.availableBalance,
          income: data?.totalIncome,
          expense: data?.totalExpense,
        }}
      />

<div className="flex flex-col-reverse items-center gap-10 w-full md:flex-row">
  <Chart data={data?.chartData} />
  {data?.totalIncome > 0 && (
    <DoughnutChart
      dt={{
        balance: data?.availableBalance,
        income: data?.totalIncome,
        expense: data?.totalExpense,
      }}
    />
  )}
</div>
<div className="flex flex-col-reverse gap-0 md:flex-row md:gap-10 2xl:gap-20">
  <Transactions data={data?.lastTransactions} />
  <Accounts/>
  </div>


    </div>
  );
};

export default Dashboard;
