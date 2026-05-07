"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import axios from "axios";

export default function LoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLoans = useCallback(async () => {
    const token = localStorage.getItem("coop_token");
    if (!token) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/loans/my-loans`,
        config,
      );

      // Sort loans: newest first
      const sortedLoans = res.data.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setLoans(sortedLoans);
    } catch (error) {
      console.error("Error fetching loans", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const formatNaira = (amountInKobo: number) => {
    return new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountInKobo / 100);
  };

  // 🚀 MATH: Calculate Portfolio Aggregates
  const activeLoans = loans.filter((l) => l.status === "APPROVED");

  const totalBorrowed = activeLoans.reduce(
    (sum, l) => sum + (l.amountDue || l.amountRequested),
    0,
  );
  const totalRepaid = activeLoans.reduce(
    (sum, l) => sum + (l.amountRepaid || 0),
    0,
  );
  const outstandingDebt = totalBorrowed - totalRepaid;

  // Badge Status Color Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-[#1b5e3a] text-[10px] font-bold uppercase tracking-wider rounded-sm">
            Active
          </span>
        );
      case "PENDING_GUARANTORS":
      case "PENDING_ADMIN":
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded-sm">
            Pending
          </span>
        );
      case "REPAID":
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-sm">
            Repaid
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2.5 py-1 bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded-sm">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-sm">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-col gap-6 h-[800px] w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="h-32 bg-slate-200 rounded-sm"></div>
          <div className="h-32 bg-slate-200 rounded-sm"></div>
          <div className="h-32 bg-slate-200 rounded-sm"></div>
          <div className="h-32 bg-slate-200 rounded-sm"></div>
        </div>
        <div className="h-48 bg-slate-200 rounded-sm w-full"></div>
        <div className="flex-1 bg-slate-200 rounded-sm w-full"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up pb-10">
      <div className="flex flex-col gap-6 w-full">
        {/* 🚀 PRO TIER: 4-Point Debt KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Borrowed (Active) */}
          <div className="bg-white rounded-sm p-6 shadow-sm border-l-4 border-slate-400 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-slate-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
              <svg
                className="w-24 h-24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
              </svg>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Amount Borrowed
            </p>
            <div className="flex items-baseline gap-1 relative z-10">
              <span className="text-xl font-bold text-slate-400">₦</span>
              <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {formatNaira(totalBorrowed)}
              </h3>
            </div>
          </div>

          {/* Card 2: Total Repaid */}
          <div className="bg-white rounded-sm p-6 shadow-sm border-l-4 border-[#1b5e3a] relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
              <svg
                className="w-24 h-24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Monthly Repayment 
            </p>
            <div className="flex items-baseline gap-1 relative z-10">
              <span className="text-xl font-bold text-slate-400">₦</span>
              <h3 className="text-3xl font-extrabold text-[#1b5e3a] tracking-tight">
                {formatNaira(totalRepaid)}
              </h3>
            </div>
          </div>

          {/* Card 3: Outstanding Debt */}
          <div className="bg-white rounded-sm p-6 shadow-sm border-l-4 border-red-500 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-red-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
              <svg
                className="w-24 h-24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Outstanding Debt
            </p>
            <div className="flex items-baseline gap-1 relative z-10">
              <span className="text-xl font-bold text-red-400">₦</span>
              <h3 className="text-3xl font-extrabold text-red-600 tracking-tight">
                {formatNaira(outstandingDebt)}
              </h3>
            </div>
          </div>

          {/* Card 4: Active Loans */}
          <div className="bg-white rounded-sm p-6 shadow-sm border-l-4 border-amber-500 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-amber-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
              <svg
                className="w-24 h-24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-9V3.5L18.5 9H13z" />
              </svg>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Active Loan Facilities
            </p>
            <div className="flex items-baseline gap-1 relative z-10">
              <h3 className="text-3xl font-extrabold text-amber-600 tracking-tight">
                {activeLoans.length}
              </h3>
            </div>
          </div>
        </div>

        {/* 🚀 PRO TIER: Visual Progress Bars for Active Loans */}
        {activeLoans.length > 0 && (
          <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6 w-full">
            <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
              Active Repayment Progress
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeLoans.map((loan) => {
                const target = loan.amountDue || loan.amountRequested;
                const repaid = loan.amountRepaid || 0;
                const progress =
                  target > 0
                    ? Math.min(Math.round((repaid / target) * 100), 100)
                    : 0;

                return (
                  <div
                    key={loan._id}
                    className="border border-slate-200 rounded-sm p-5 bg-slate-50 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800">
                          {loan.loanType}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Applied on{" "}
                          {new Date(loan.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-[#1b5e3a]">
                        {progress}%
                      </span>
                    </div>

                    {/* The Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2.5 my-4">
                      <div
                        className="bg-[#1b5e3a] h-2.5 rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <p className="text-slate-500 text-xs">Repaid</p>
                        <p className="font-bold text-slate-800">
                          ₦{formatNaira(repaid)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-500 text-xs">Remaining</p>
                        <p className="font-bold text-red-500">
                          ₦{formatNaira(target - repaid)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 🚀 STRICT DEMARCATION: Loan History Ledger Container */}
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-slate-100 pb-4 gap-4">
            <h3 className="text-xl font-bold text-slate-800">Loan Ledger</h3>
            <Link
              href="/dashboard/loans/apply"
              className="bg-[#1b5e3a] hover:bg-[#124228] text-white px-5 py-2 rounded-sm text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
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
              Apply for Loan
            </Link>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3 px-4 font-bold text-slate-700 text-sm border border-slate-200">
                    Loan Type
                  </th>
                  <th className="py-3 px-4 font-bold text-slate-700 text-sm border border-slate-200 text-center">
                    Status
                  </th>
                  <th className="py-3 px-4 font-bold text-slate-700 text-sm border border-slate-200 text-right">
                    Amount Borrowed
                  </th>
                  <th className="py-3 px-4 font-bold text-slate-700 text-sm border border-slate-200 text-right">
                    Amount Repaid
                  </th>
                  <th className="py-3 px-4 font-bold text-slate-700 text-sm border border-slate-200 text-right">
                    Balance
                  </th>
                  <th className="py-3 px-4 font-bold text-slate-700 text-sm border border-slate-200">
                    Date Applied
                  </th>
                </tr>
              </thead>
              <tbody>
                {loans.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-slate-500 border border-slate-200"
                    >
                      No loan history found.
                    </td>
                  </tr>
                ) : (
                  loans.map((loan) => {
                    const target = loan.amountDue || loan.amountRequested;
                    const repaid = loan.amountRepaid || 0;
                    const balance = target - repaid;

                    return (
                      <tr
                        key={loan._id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-slate-800 font-bold border border-slate-200">
                          {loan.loanType}
                        </td>
                        <td className="py-3 px-4 text-center border border-slate-200">
                          {getStatusBadge(loan.status)}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium text-right border border-slate-200">
                          ₦{formatNaira(target)}
                        </td>
                        <td className="py-3 px-4 text-[#1b5e3a] font-bold text-right border border-slate-200">
                          ₦{formatNaira(repaid)}
                        </td>
                        <td className="py-3 px-4 text-red-500 font-bold text-right border border-slate-200">
                          {balance > 0 ? `₦${formatNaira(balance)}` : "₦0.00"}
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px] leading-tight border border-slate-200">
                          {new Date(loan.createdAt).toLocaleDateString()}
                          <br />
                          {new Date(loan.createdAt).toLocaleTimeString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
