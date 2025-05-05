import React, { useState, useEffect } from "react";
import useStore  from "../store/index";
import Title from "../components/Title";
import api from "../libs/apiCall";
import { toast } from "sonner";

const Settings = () => {
  const { user, setCredential } = useStore((state) => state);

  // Form data state
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    country: "",
    currency: "",
    contact: "",
  });

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);

  // Populate form with user data on mount
  useEffect(() => {
    if (user?.user) {
      setFormData({
        firstname: user.user.firstname || "",
        lastname: user.user.lastname || "",
        country: user.user.country || "",
        currency: user.user.currency || "",
        contact: user.user.contact || "",
      });
    }
  }, [user]);

  // Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Country-specific currency update
  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const countryCurrencyMap = {
      USA: "USD",
      Canada: "CAD",
      UK: "GBP",
      India: "INR",
      Australia: "AUD",
    };
    const selectedCurrency = countryCurrencyMap[selectedCountry] || "USD";

    setFormData((prev) => ({
      ...prev,
      country: selectedCountry,
      currency: selectedCurrency,
    }));
  };

  // Submit handler
  const onSubmit = async (e) => {
    e.preventDefault();
    const userId = user?.user?.id;

    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    try {
      const res = await api.put(`/user/${userId}`, formData);
      
      if (res.data.status === "success") {
        toast.success(res.data.message);
      
        // console.log("Updated user in store:", useStore.getState().user);
        setIsEditing(false);  // Exit edit mode after submission
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
  
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-4xl px-4 py-4 my-6 shadow-lg bg-gray-50 rounded-xl dark:bg-black/20 md:px-10 md:my-10">
        <div className="mt-6 border-b-2 border-gray-200 dark:border-gray-800">
          <Title title="General Settings" />
        </div>

        <div className="py-10">
          <p className="text-lg font-bold text-black dark:text-white">
            Profile Information
          </p>

          <div className="flex items-center gap-4 my-8">
            <div className="flex items-center justify-center w-12 h-12 text-white rounded-full cursor-pointer bg-[#000] font-bold text-2xl">
              <p>{formData.firstname?.charAt(0).toUpperCase() || "?"}</p>
            </div>
            <p className="text-2xl font-light text-black dark:text-gray-400">
              {formData.firstname}
            </p>
          </div>

          {/* Profile Section / Editable Form */}
          {isEditing ? (
            <form
              onSubmit={onSubmit}
              className="space-y-4 bg-gray-100 p-6 rounded-lg shadow-md dark:bg-gray-900"
            >
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  name="firstname"
                  onChange={handleChange}
                  value={formData.firstname}
                  className="px-4 py-2 mt-1 border rounded-md dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  name="lastname"
                  onChange={handleChange}
                  value={formData.lastname}
                  className="px-4 py-2 mt-1 border rounded-md dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleCountryChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                >
                  <option value="USA">USA</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">UK</option>
                  <option value="India">India</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Currency
                </label>
                <input
                  name="currency"
                  onChange={handleChange}
                  value={formData.currency}
                  readOnly
                  className="px-4 py-2 mt-1 border rounded-md dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Contact
                </label>
                <input
                  name="contact"
                  onChange={handleChange}
                  value={formData.contact}
                  className="px-4 py-2 mt-1 border rounded-md dark:bg-gray-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 mt-4 text-white bg-black rounded-md hover:bg-black-600"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4 bg-gray-100 p-6 rounded-lg shadow-md dark:bg-gray-900">
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  First Name
                </p>
                <p className="px-4 py-2 mt-1 dark:text-white">{formData.firstname}</p>
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Last Name
                </p>
                <p className="px-4 py-2 mt-1 dark:text-white">{formData.lastname}</p>
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Country
                </p>
                <p className="px-4 py-2 mt-1 dark:text-white">{formData.country}</p>
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Currency
                </p>
                <p className="px-4 py-2 mt-1 dark:text-white">{formData.currency}</p>
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Contact
                </p>
                <p className="px-4 py-2 mt-1 dark:text-white">{formData.contact}</p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-4 py-2 mt-4 text-white bg-black rounded-md hover:bg-black-600"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
