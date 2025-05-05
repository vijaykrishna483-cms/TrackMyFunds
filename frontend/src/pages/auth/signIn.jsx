import React, { useEffect, useState } from "react";
import * as z from "zod";
import useStore from "../../store/index";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { SocialAuth } from "../../components/social-auth";
import { Separator } from "../../components/separator";
import Input from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {BiLoader} from "react-icons/bi";
import api from "../../libs/apiCall";
import { toast } from "sonner";
import { setAuthToken } from '../../libs/apiCall';

const LoginSchema = z.object({
  email: z
    .string({ required_errorr: "Email is required" })
    .email("Email is not valid"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

const signIn = () => {
  const { user ,setCredential} = useStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    user && navigate("/");
  }, [user]);
  const onSubmit = async (data) => {
    try {
      setLoading(true);
  
      const { data: res } = await api.post("/auth/sign-in", data);
      // console.log("Login response:", res);
  
      if (res?.status === "success" && res?.data) {
        toast.success(res?.message || "Login successful.");
  
        // Ensure you're storing the token correctly
        const userInfo = { ...res?.data, token: res.data.token };
        localStorage.setItem("user", JSON.stringify(userInfo));  // Save the user data along with token
        localStorage.setItem("auth_token", res.data.token);  // Explicitly store token
  
        // Set the token in the Axios header for future requests
        setAuthToken(res.token);
  
        setCredential(userInfo);
  
        setTimeout(() => {
          navigate("/overview");
        }, 1500);
      } else {
        toast.error(res?.message || "Login failed.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center w-full min-h-screen py-10">
      <Card className="w-[400px] bg-white dark:bg-black/20 shadow-md overflow-hidden">
        <div className="p-6 mdLp-8">
          <CardHeader className="py-0">
            <CardTitle className="mb-8 text-center dark:text-white">
             Sign In
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
<div className="mb-8 space-y-6">
<SocialAuth isLoading={loading} setLoading={setLoading}/>
<Separator/>


<Input
disabled={loading}
id="email"
label="Email"

type="email"
placeholder="Enter Your email"
error={errors.email?.message}

{...register("email")}
className="text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-one"
/>


<Input
disabled={loading}
id="password"
label="Password"

type="password"
placeholder="your password"
error={errors.password?.message}

{...register("password")}
className="text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-one"
/>
</div>

<Button type="submit" disabled={loading} className="w-full bg-violet-800 ">
{loading ? <BiLoader className="text-2xl text-white animate-spin"/> : " Sign In"}
</Button>
       </form>
          </CardContent>
        </div>

        <CardFooter className="justify-center gap-2">
          <p className="text-sm text-greay-600 dark:text-white">Don't have an account?</p>
        <Link to="/sign-up" className="text-sm text-violet-800 hover:underline ">
            Sign Up
        </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default signIn;
