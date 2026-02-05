import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 🔒 Dummy hata diya – backend se aayega
const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔜 REAL API YAHAN AAYEGI
    // invoiceService.getInvoices().then(res => setInvoices(res.data))
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Invoices
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Billing invoices generated for enrollments
        </p>
      </div>

      {/* Card */}
      <Card className="bg-black text-white dark:bg-slate-900 border border-slate-700">
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-400">Loading invoices...</p>
          ) : invoices.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm font-medium">
                No invoices found
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Invoices will appear here once payments are created.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700 text-slate-300">
                  <tr>
                    <th className="py-3 text-left">Invoice</th>
                    <th className="py-3 text-left">Client</th>
                    <th className="py-3 text-left">Amount</th>
                    <th className="py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((i) => (
                    <tr
                      key={i.id}
                      className="border-b border-slate-800 hover:bg-slate-800/60 transition"
                    >
                      <td className="py-3">{i.id}</td>
                      <td className="py-3">{i.client}</td>
                      <td className="py-3">{i.amount}</td>
                      <td className="py-3">
                        <Badge
                          variant={
                            i.status === "PAID"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {i.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Invoices;
