"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function SavingsPage() {
  const [account, setAccount] = useState({
    totalSavings: 0,
    availableCreditLimit: 0,
    customMonthlySavings: 0,
  });
  const [activeLoansCount, setActiveLoansCount] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>({
    firstName: "Member",
    lastName: "",
    email: "",
    fileNumber: "",
    avatarUrl: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("coop_user");
    const token = localStorage.getItem("coop_token");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchAccountData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [accountRes, loansRes, txnRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/account/my-account`,
            config,
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/loans/my-loans`,
            config,
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/account/transactions`,
            config,
          ),
        ]);

        setAccount(accountRes.data);
        setActiveLoansCount(
          loansRes.data.filter((l: any) => l.status === "APPROVED").length,
        );
        setTransactions(txnRes.data);
      } catch (error) {
        console.error("Error fetching account data", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchAccountData();
  }, []);

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (txn.effectiveMonth &&
        txn.effectiveMonth.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  if (isLoading) {
    return (
      <div className="animate-pulse flex gap-6 h-[800px]">
        <div className="w-1/3 bg-slate-200 rounded-sm"></div>
        <div className="w-2/3 bg-slate-200 rounded-sm"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: NESTED PROFILE CARD */}
        <div className="lg:col-span-4 flex flex-col shadow-sm border border-slate-200 bg-white rounded-sm overflow-hidden">
          <div className="bg-[#2B2F42] pt-10 pb-8 px-6 flex flex-col items-center text-center text-white">
            <div className="w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden mb-4 bg-slate-700 flex items-center justify-center text-4xl font-bold">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                user.lastName?.charAt(0) || "U"
              )}
            </div>
            <h2 className="text-xl font-semibold tracking-wide mb-1">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-slate-300 mb-1">{user.email}</p>
            <p className="text-sm text-slate-300 mb-6">
              Membership No: <br />
              <span className="font-bold text-lg">{user.fileNumber}</span>
            </p>
            <span className="px-5 py-1.5 bg-[#20C997] text-white text-xs font-bold rounded-sm uppercase tracking-wider">
              Active
            </span>
          </div>

          <div className="flex flex-col bg-white">
            <Link
              href="/dashboard"
              className="px-6 py-4 border-b border-slate-100 font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3"
            >
              <svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </Link>
            <div className="px-6 py-4 bg-slate-100 border-l-4 border-slate-400 font-semibold text-slate-700 flex items-center gap-3">
              <svg
                className="w-5 h-5 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Savings / Withdrawals
            </div>
            <Link
              href="/dashboard/loans"
              className="px-6 py-4 border-b border-slate-100 font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3"
            >
              <svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Loan Transactions
            </Link>
            <Link
              href="/dashboard/profile"
              className="px-6 py-4 bg-white font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3"
            >
              <svg
                className="w-5 h-5 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile / Bio Data
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: STATS & DATA TABLE */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Top 3 Stat Cards */}
          <div className="bg-[#2B2F42] p-6 rounded-sm grid grid-cols-1 sm:grid-cols-3 gap-6 shadow-md">
            <div className="bg-white rounded-sm p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="flex items-start justify-center gap-1 mb-2">
                <span className="text-xl font-medium text-slate-500 mt-1">
                  ₦
                </span>
                <h3 className="text-3xl font-bold text-slate-700 tracking-tight">
                  {formatNaira(account.totalSavings / 100)}
                </h3>
              </div>
              <p className="text-sm text-slate-500 italic">Account Balance</p>
            </div>
            <div className="bg-white rounded-sm p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="flex items-start justify-center gap-1 mb-2">
                <span className="text-xl font-medium text-slate-500 mt-1">
                  ₦
                </span>
                <h3 className="text-3xl font-bold text-slate-700 tracking-tight">
                  {formatNaira((account.customMonthlySavings || 1500000) / 100)}
                </h3>
              </div>
              <p className="text-sm text-slate-500 italic">
                Agreed Monthly Savings
              </p>
            </div>
            <div className="bg-white rounded-sm p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <h3 className="text-3xl font-bold text-slate-700 tracking-tight mb-2">
                {activeLoansCount}
              </h3>
              <p className="text-sm text-slate-500 italic">
                Total no of Active Loans
              </p>
            </div>
          </div>

          {/* Savings Data Table Container */}
          <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6">
            <h3 className="text-2xl font-bold text-slate-700 text-center mb-6">
              Savings
            </h3>
            {/* Table Controls (Updates top buttons) */}
            <div className="flex flex-col xl:flex-row justify-between items-center mb-4 gap-4">
              <div className="flex items-center gap-1 flex-wrap">
                {/* 🚀 Updated 'Copy' button to ASCON Green */}
                <button className="px-3 py-1 bg-[#1b5e3a] text-white text-xs font-semibold rounded-sm shadow-sm hover:opacity-90">
                  Copy
                </button>
                <button className="px-3 py-1 bg-[#8B98A1] text-white text-xs font-semibold rounded-sm shadow-sm hover:opacity-90">
                  CSV
                </button>
                <button className="px-3 py-1 bg-[#20C997] text-white text-xs font-semibold rounded-sm shadow-sm hover:opacity-90">
                  Excel
                </button>
                <button className="px-3 py-1 bg-[#F39C12] text-white text-xs font-semibold rounded-sm shadow-sm hover:opacity-90">
                  PDF
                </button>
                <button className="px-3 py-1 bg-[#00B5E2] text-white text-xs font-semibold rounded-sm shadow-sm hover:opacity-90">
                  Print
                </button>
              </div>
              {/* ... */}
            </div>
            {/* The Table Header Add Button */}
            <th className="py-3 px-4 font-bold text-slate-700 text-center w-24">
              {/* 🚀 Updated 'Add New' button to ASCON Green */}
              <button className="bg-[#1b5e3a] text-white px-3 py-1.5 rounded-sm flex items-center justify-center gap-1 text-xs mx-auto w-full">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New
              </button>
            </th>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 text-sm text-slate-600">
              <p>
                Showing 1 to {filteredTransactions.length} of{" "}
                {filteredTransactions.length} Entries
              </p>
              <div className="flex">
                <button className="px-3 py-1 border border-slate-200 bg-slate-50 rounded-l-sm hover:bg-slate-100">
                  Previous
                </button>
                {/* 🚀 Updated Active Pagination Page to ASCON Green */}
                <button className="px-3 py-1 border-t border-b border-[#1b5e3a] bg-[#1b5e3a] text-white">
                  1
                </button>
                <button className="px-3 py-1 border border-slate-200 bg-slate-50 rounded-r-sm hover:bg-slate-100">
                  Next
                </button>
              </div>
            </div>
            {/* The Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="py-3 px-4 font-bold text-slate-700 w-12">
                      #
                    </th>
                    <th className="py-3 px-4 font-bold text-slate-700 text-center w-24">
                      <button className="bg-[#6A5AE0] text-white px-3 py-1.5 rounded-sm flex items-center justify-center gap-1 text-xs mx-auto w-full">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add New
                      </button>
                    </th>
                    <th className="py-3 px-4 font-bold text-slate-700">
                      EFFECTIVE
                      <br />
                      MONTH
                    </th>
                    <th className="py-3 px-4 font-bold text-slate-700">
                      DESCRIPTION
                    </th>
                    <th className="py-3 px-4 font-bold text-slate-700 text-right">
                      DEBIT
                    </th>
                    <th className="py-3 px-4 font-bold text-slate-700 text-right">
                      CREDIT
                    </th>
                    <th className="py-3 px-4 font-bold text-slate-700">
                      SHARED
                      <br />
                      CAPITAL
                    </th>
                    <th className="py-3 px-4 font-bold text-slate-700">
                      DATE
                      <br />
                      MODIFIED
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-8 text-center text-slate-500"
                      >
                        {searchQuery
                          ? "No matching transactions found."
                          : "No transactions recorded yet."}
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((txn, index) => (
                      <tr
                        key={txn._id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-3 px-4 text-slate-500">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4">
                          <button className="bg-[#00B5E2] text-white px-3 py-1.5 rounded-sm flex items-center justify-center gap-1 text-xs mx-auto w-full">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                              />
                            </svg>
                            <svg
                              className="w-3 h-3 ml-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {txn.effectiveMonth || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {txn.description}
                        </td>
                        <td className="py-3 px-4 text-red-500 text-right font-medium">
                          {txn.type === "DEBIT"
                            ? formatNaira(txn.amount / 100)
                            : ""}
                        </td>
                        <td className="py-3 px-4 text-slate-800 text-right font-bold">
                          {txn.type === "CREDIT"
                            ? formatNaira(txn.amount / 100)
                            : ""}
                        </td>
                        <td className="py-3 px-4 text-slate-600"></td>
                        <td className="py-3 px-4 text-slate-500 text-[11px] leading-tight">
                          {new Date(txn.createdAt).toLocaleDateString()}
                          <br />
                          {new Date(txn.createdAt).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Placeholder */}
            <div className="flex justify-between items-center mt-6 text-sm text-slate-600">
              <p>
                Showing 1 to {filteredTransactions.length} of{" "}
                {filteredTransactions.length} Entries
              </p>
              <div className="flex">
                <button className="px-3 py-1 border border-slate-200 bg-slate-50 rounded-l-sm hover:bg-slate-100">
                  Previous
                </button>
                <button className="px-3 py-1 border-t border-b border-slate-200 bg-[#6A5AE0] text-white">
                  1
                </button>
                <button className="px-3 py-1 border border-slate-200 bg-slate-50 rounded-r-sm hover:bg-slate-100">
                  Next
                </button>
              </div>
            </div>
            {/* Bottom Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-[#f8f9fe] p-5 rounded-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-1">
                  <div className="bg-purple-100 p-2 rounded-sm text-purple-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700">
                    ₦{formatNaira(account.totalSavings / 100)}
                  </h3>
                </div>
                <p className="text-slate-500 text-sm font-medium ml-11">
                  Total Saving
                </p>
              </div>

              <div className="bg-[#f8f9fe] p-5 rounded-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-1">
                  <div className="bg-orange-100 p-2 rounded-sm text-orange-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700">₦0.00</h3>
                </div>
                <p className="text-slate-500 text-sm font-medium ml-11">
                  Total Shared Capital
                </p>
              </div>

              <div className="bg-[#f8f9fe] p-5 rounded-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-1">
                  <div className="bg-red-100 p-2 rounded-sm text-red-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700">₦0.00</h3>
                </div>
                <p className="text-slate-500 text-sm font-medium ml-11">
                  Total Debit/ Withdrawal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
