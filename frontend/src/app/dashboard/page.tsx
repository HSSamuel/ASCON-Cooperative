"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardOverview() {
  const [account, setAccount] = useState({
    totalSavings: 0,
    availableCreditLimit: 0,
    customMonthlySavings: 0,
  });
  const [loans, setLoans] = useState<any[]>([]);
  const [activeLoan, setActiveLoan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
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

    const fetchDashboardData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [accountRes, loansRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/account/my-account`,
            config,
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/loans/my-loans`,
            config,
          ),
        ]);

        setAccount(accountRes.data);
        setLoans(loansRes.data);

        const currentLoan = loansRes.data.find((loan: any) =>
          ["PENDING_GUARANTORS", "PENDING_ADMIN", "APPROVED"].includes(
            loan.status,
          ),
        );
        setActiveLoan(currentLoan || null);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchDashboardData();
  }, []);

  const formatNaira = (koboAmount: number) => {
    return new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(koboAmount / 100);
  };

  const activeLoansCount = loans.filter((l) => l.status === "APPROVED").length;

  // Chart Data Mapping based on the dashboard.jpg mockup
  const chartData = [
    {
      name: "Savings",
      CREDIT: 0,
      DEBIT: account.totalSavings / 100,
    },
    {
      name: "Loan",
      CREDIT: activeLoan
        ? (activeLoan.amountDue || activeLoan.amountRequested) / 100
        : 0,
      DEBIT: activeLoan ? activeLoan.amountRepaid / 100 : 0,
    },
    {
      name: "Shares",
      CREDIT: 0,
      DEBIT: 25000, // Mock fixed share capital
    },
    {
      name: "Target Svs",
      CREDIT: 0,
      DEBIT: 0,
    },
    {
      name: "Commodity",
      CREDIT: 0,
      DEBIT: 0,
    },
  ];

  if (isLoading) {
    return (
      <div className="animate-pulse flex gap-6 h-[800px]">
        <div className="w-1/3 bg-slate-200 rounded-sm"></div>
        <div className="w-2/3 flex flex-col gap-6">
          <div className="h-40 bg-slate-200 rounded-sm"></div>
          <div className="flex-1 bg-slate-200 rounded-sm"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: NESTED PROFILE CARD (From coop3.jpg) */}
        <div className="lg:col-span-4 flex flex-col shadow-sm border border-slate-200 bg-white rounded-sm overflow-hidden">
          {/* Top Profile Section */}
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

          {/* Inner Navigation Menu */}
          <div className="flex flex-col bg-white">
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </div>
            <Link
              href="/dashboard/savings"
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Savings / Withdrawals
            </Link>
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Loan Applications
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: STAT CARDS & CHARTS */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Top 3 Stat Cards (From coop5.jpg) */}
          <div className="bg-[#2B2F42] p-6 rounded-sm grid grid-cols-1 sm:grid-cols-3 gap-6 shadow-md">
            <div className="bg-white rounded-sm p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="flex items-start justify-center gap-1 mb-2">
                <span className="text-xl font-medium text-slate-500 mt-1">
                  ₦
                </span>
                <h3 className="text-3xl font-bold text-slate-700 tracking-tight">
                  {formatNaira(account.totalSavings)}
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
                  {formatNaira(
                    account.customMonthlySavings ||
                      1500000 /* Defaulting to 15k fallback for visual parity */,
                  )}
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

          {/* Interactive Bar Chart (From dashboard.jpg) */}
          <div className="bg-white rounded-sm p-6 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-700">
                  Society Reports for This Month
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Savings & Loans Overview
                </p>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <svg
                  className="w-6 h-6"
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
              </button>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  barGap={2}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    tickFormatter={(value) => `${value.toLocaleString()}`}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend
                    align="right"
                    verticalAlign="top"
                    iconType="square"
                    wrapperStyle={{ paddingBottom: "20px" }}
                  />
                  <Bar
                    dataKey="CREDIT"
                    fill="#00B5E2"
                    name="CREDIT"
                    barSize={24}
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="DEBIT"
                    fill="#00E396"
                    name="DEBIT"
                    barSize={24}
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
