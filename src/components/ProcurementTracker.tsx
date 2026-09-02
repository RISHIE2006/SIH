"use client";

import React, { useState } from "react";
import { ProcurementRecord, Language } from "@/lib/types";
import { translations } from "@/lib/translations";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, ShieldCheck, Download, Search, Banknote, Scale, AlertCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ProcurementTrackerProps {
  lang: Language;
  procurements: ProcurementRecord[];
}

export const ProcurementTracker: React.FC<ProcurementTrackerProps> = ({
  lang,
  procurements,
}) => {
  const t = translations[lang];
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<ProcurementRecord | null>(null);

  const filtered = procurements.filter(
    (p) =>
      p.farmerName.toLowerCase().includes(search.toLowerCase()) ||
      p.tokenId.toLowerCase().includes(search.toLowerCase()) ||
      p.cropType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-beige-200 shadow-card">
        <div>
          <h2 className="text-xl font-bold text-beige-900">{t.procTitle}</h2>
          <p className="text-xs text-beige-600 mt-0.5">{t.procSubtitle}</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-beige-400" />
          <input
            type="text"
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-beige-50 border border-beige-300 rounded-xl text-xs text-beige-900 focus:outline-none focus:ring-2 focus:ring-wheat-500"
          />
        </div>
      </div>

      {/* Procurement Table / Empty State */}
      <div className="bg-white rounded-2xl border border-beige-200 shadow-card overflow-hidden">
        {procurements.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-3">
            <Banknote className="w-12 h-12 text-wheat-400 mx-auto" />
            <h3 className="text-base font-bold text-beige-900">No DBT Procurement Records Yet</h3>
            <p className="text-xs text-beige-600 max-w-md mx-auto">
              Once a farmer token completes quality testing & weighbridge measurement at the Mandi Officer Desk, the official MSP receipt & DBT bank transaction record will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-beige-900">
              <thead className="bg-beige-100/70 border-b border-beige-200 text-beige-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Token & Farmer</th>
                  <th className="py-3.5 px-4 font-bold">{t.tableCrop}</th>
                  <th className="py-3.5 px-4 font-bold">{t.tableGrade}</th>
                  <th className="py-3.5 px-4 font-bold">{t.tableWeight}</th>
                  <th className="py-3.5 px-4 font-bold">{t.tableAmount}</th>
                  <th className="py-3.5 px-4 font-bold">{t.tableStatus}</th>
                  <th className="py-3.5 px-4 text-right font-bold">{t.tableAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-200">
                {filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-beige-50/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-mono font-bold text-beige-900">{record.tokenId}</div>
                      <div className="font-semibold text-beige-800">{record.farmerName}</div>
                      <div className="text-[10px] text-beige-500">{record.centerName}</div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-beige-800">
                      {record.cropType}
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                        {record.assessment.grade}
                      </span>
                      <div className="text-[10px] text-beige-500 mt-0.5">
                        Moisture: {record.assessment.moisturePercentage}%
                      </div>
                    </td>

                    <td className="py-4 px-4 font-bold text-beige-900">
                      {record.netWeightQuintals} Qt
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-extrabold text-amber-900 text-sm">
                        {formatCurrency(record.totalAmount)}
                      </div>
                      <div className="text-[10px] text-beige-500 font-mono">
                        @ ₹{record.mspRatePerQuintal}/Qt
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 w-fit ${
                          record.paymentStatus === "Credited"
                            ? "bg-leaf-50 text-leaf-700 border-leaf-400"
                            : "bg-amber-50 text-amber-900 border-amber-300"
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {record.paymentStatus}
                      </span>
                      {record.dbtRefNo && (
                        <div className="text-[9px] text-beige-500 font-mono mt-0.5">
                          Ref: {record.dbtRefNo}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="px-3 py-1.5 rounded-lg bg-beige-100 hover:bg-beige-200 text-beige-800 font-semibold text-xs transition-colors"
                      >
                        {t.viewDetails}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice / Receipt Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-beige-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-beige-200 rounded-2xl max-w-md w-full p-6 shadow-glass space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-beige-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-wheat-600" />
                <h3 className="font-bold text-beige-900 text-base">
                  Official Mandi MSP Invoice
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-beige-500 hover:text-beige-900"
              >
                ✕
              </button>
            </div>

            <div className="bg-wheat-50 p-4 rounded-xl border border-wheat-200 text-xs space-y-2">
              <div className="flex justify-between font-mono font-bold text-beige-900 border-b border-wheat-200 pb-2">
                <span>Receipt #: {selectedRecord.id}</span>
                <span>Token: {selectedRecord.tokenId}</span>
              </div>
              
              <div className="space-y-1 text-beige-800 pt-1">
                <p><strong>Farmer Name:</strong> {selectedRecord.farmerName}</p>
                <p><strong>Procurement Yard:</strong> {selectedRecord.centerName}</p>
                <p><strong>Crop Type:</strong> {selectedRecord.cropType}</p>
                <p><strong>Moisture Test:</strong> {selectedRecord.assessment.moisturePercentage}% (Passed)</p>
                <p><strong>Net Quintals:</strong> {selectedRecord.netWeightQuintals} Qt</p>
                <p><strong>Official MSP Rate:</strong> ₹{selectedRecord.mspRatePerQuintal} / Qt</p>
              </div>

              <div className="border-t border-wheat-200 pt-2 flex justify-between items-center text-sm font-extrabold text-beige-900">
                <span>Total MSP Payable:</span>
                <span className="text-amber-900">{formatCurrency(selectedRecord.totalAmount)}</span>
              </div>
            </div>

            <div className="bg-leaf-50 p-3 rounded-xl border border-leaf-200 text-xs flex items-center gap-2 text-leaf-800">
              <ShieldCheck className="w-5 h-5 text-leaf-600 flex-shrink-0" />
              <div>
                <p className="font-bold">Direct Benefit Transfer (DBT)</p>
                <p className="text-[11px]">Transferred to Aadhaar Linked Bank Account (Ref: {selectedRecord.dbtRefNo})</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => alert(`Official MSP Receipt downloaded for ${selectedRecord.farmerName} (${selectedRecord.id})`)}
                className="w-full py-2.5 rounded-xl bg-beige-900 text-beige-50 font-bold text-xs flex items-center justify-center gap-2 hover:bg-beige-800"
              >
                <Download className="w-4 h-4" />
                <span>{t.downloadReceipt}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
