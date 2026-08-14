'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { formatDate } from '@/lib/utils';
import { History, Shield, RefreshCw } from 'lucide-react';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="flex-1 space-y-6">
      <AdminHeader
        title="Audit Activity Logs"
        subtitle="Complete chronological audit trail of orders, payment verifications, and delivery actions."
      >
        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-google-blue' : 'text-gray-500'}`} />
          <span>Refresh</span>
        </button>
      </AdminHeader>

      <div className="px-6 max-w-7xl">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-google-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-400 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Action</th>
                  <th className="px-6 py-3.5">Details</th>
                  <th className="px-6 py-3.5">Associated Order</th>
                  <th className="px-6 py-3.5">Performed By</th>
                  <th className="px-6 py-3.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      Loading audit logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      No audit logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">
                        <span className="bg-gray-100 px-2 py-1 rounded-md text-[11px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-md">
                        {log.details}
                      </td>
                      <td className="px-6 py-4 font-mono">
                        {log.order ? (
                          <span className="font-bold text-google-blue">
                            #{log.order.orderNumber}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-semibold">
                        {log.performedBy}
                      </td>
                      <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                        {formatDate(log.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
