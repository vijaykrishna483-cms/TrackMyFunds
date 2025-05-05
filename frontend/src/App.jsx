import "./App.css";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import SignIn from "./pages/auth/signIn";
import SignUp from "./pages/auth/signUp";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";
import Accountpage from "./pages/accountPage";
import Transactions from "./pages/transactions";
import  useStore  from "./store/index";
import { setAuthToken } from "./libs/apiCall";
import { Toaster } from "sonner";
import Navbar from "./components/navbar";
import { useEffect } from "react";
import BudgetPage from "./pages/budgetPage"




const RootLayout = () => {
  const { user } = useStore((state) => state); 
 setAuthToken(user?.token || "");
  return !user ? (
    <Navigate to="/sign-in" replace={true}/>
  ) : (
    <>
        <Navbar/>
    <div className="min-g-[calc(h-screen-100px)]">
      <Outlet />
    </div>
    </>

  );
};

function App() {
  const {theme}=useStore((state)=>state)

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    }else {
      document.body.classList.remove("dark");

    }
  },[theme])
  return (
    <main>
      <div className="w-full min-h-screen px-6 bg-gray-100 md:px-20 dark:bg-gray-900">
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Navigate to="/overview" />} />
            <Route path="/overview" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/accounts" element={<Accountpage />} />
            <Route path="/budget" element={<BudgetPage />} />

          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </div>
      <Toaster richColors position="top-center" />
    </main>
  );
}

export default App;
