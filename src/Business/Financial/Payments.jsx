import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Payments = () => {
  // ❌ dummy data hata diya
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔜 REAL API CALL YAHAN AAYEGI
    // paymentService.getPayments().then(res => setPayments(res.data))
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Payments
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Track all successful and pending payments
        </p>
      </div>

      {/* Card */}
      <Card className="bg-black text-white dark:bg-slate-900 border border-slate-700">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-400">Loading payments...</p>
          ) : payments.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium">
                No payments recorded
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Payments will appear here once transactions are completed.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="
                    flex items-center justify-between
                    rounded-xl border border-slate-700
                    bg-slate-900/80 px-4 py-3
                  "
                >
                  <div>
                    <p className="text-sm font-semibold">{p.client}</p>
                    <p className="text-xs text-slate-400">
                      {p.mode} · {p.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-emerald-400">
                      {p.amount}
                    </p>
                    <Badge variant="success">Paid</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
