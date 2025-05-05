import React, { useEffect, useState } from 'react';
import api from '../libs/apiCall';
import { toast } from 'sonner';

const BudgetPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ description: '', limit: '' });
  const [newData, setNewData] = useState([]);

  const handleAddBudget = async () => {
    try {
      const payload = {
        description: formData.description,
        goalamount: parseFloat(formData.limit),
      };

      const { data: res } = await api.post('/budget/addBudget', payload);

      if (res?.status === 'success' && res?.data) {
        toast.success('Budget Added successfully');
        setShowModal(false);
        setFormData({ description: '', limit: '' });
        // Refresh data
        const { data: budgetRes } = await api.get('/budget');
        const { data: txRes } = await api.get('/transaction');
        const budgets = (budgetRes?.data || []).map((budget) => {
          const totalExpense = (txRes?.data || [])
            .filter(
              (tx) =>
                tx.description.toLowerCase() === budget.description.toLowerCase() &&
                tx.type === 'expense'
            )
            .reduce((sum, tx) => sum + Number(tx.amount), 0);
          return { ...budget, current: totalExpense };
        });
        setData(budgets);
        setTransactions(txRes?.data || []);
      } else {
        toast.error(res?.message || 'Failed to add budget.');
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data: budgetRes } = await api.get('/budget');
        const { data: txRes } = await api.get('/transaction');

        const budgets = (budgetRes?.data || []).map((budget) => {
          const totalExpense = (txRes?.data || [])
            .filter(
              (tx) =>
                tx.description.toLowerCase() === budget.description.toLowerCase() &&
                tx.type === 'expense'
            )
            .reduce((sum, tx) => sum + Number(tx.amount), 0);

          return { ...budget, current: totalExpense };
        });

        setData(budgets);
        setTransactions(txRes?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Budget Overview</h1>

      <div className="grid grid-cols-3 font-semibold border-b pb-2 mb-2">
        <div>Description</div>
        <div>Limit (₹)</div>
        <div>Current (₹)</div>
      </div>

      {data.map((budget, index) => (
        <div
          key={index}
          className={`grid grid-cols-3 py-2 border-b text-sm ${
            budget.current > budget.goalamount ? 'text-red-600' : ''
          }`}
        >
          <div>{budget.description}</div>
          <div>₹{budget.goalamount}</div>
          <div>₹{budget.current}</div>
        </div>
      ))}

      <button
        onClick={() => setShowModal(true)}
        className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        Add Budget
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80 dark:bg-gray-700 dark:text-white">
            <h2 className="text-lg font-bold mb-4">Add New Budget</h2>
            <input
              type="text"
              placeholder="Description"
              className="w-full mb-3 p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Limit"
              className="w-full mb-3 p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              value={formData.limit}
              onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBudget}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;
