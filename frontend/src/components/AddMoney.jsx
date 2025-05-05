import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// import { formatCurrency } from "../../libs";
import api from "../libs/apiCall";
import { Button } from "../components/ui/button";
import InputField from "../components/ui/input";
import { formatCurrency } from "../libs/index";

// Codiumate: Options | Test this function
const AddMoney = ({ isOpen, setIsOpen, id, refetch }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const submitHandler = async (data) => {
    try {
      setLoading(true);
      const { amount } = data;
      const { data: res } = await api.put(`/account/add-money/${id}`, {
        amount: parseFloat(amount),
      });

      //   const { data: res } = await api.put(`/account/add-money/${id}`, data);

      if (res?.data) {
        toast.success(res?.message);
        setIsOpen(false);
        refetch();
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left align-middle shadow-xl transition-all">
          <DialogTitle className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-300 mb-4 uppercase">
            Add Money to Account
          </DialogTitle>
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
            <InputField
              type="number"
              id="amount"
              label="Amount"
              placeholder="10.56"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 0.01, message: "Amount must be greater than 0" },
              })}
              error={errors.amount?.message}
            />

            <div className="w-full mt-8">
              <Button
                disabled={loading}
                type="submit"
                className="bg-violet-700 text-white w-full"
              >
                {`Submit ${
                  watch("amount") ? formatCurrency(watch("amount")) : ""
                }`}
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddMoney;
