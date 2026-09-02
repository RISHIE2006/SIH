"use client";

import React, { useState } from "react";
import { Farmer, Language } from "@/lib/types";
import { translations } from "@/lib/translations";
import { X, UserPlus, ShieldCheck, CheckCircle2 } from "lucide-react";

interface FarmerRegistrationModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (farmer: Farmer) => void;
}

export const FarmerRegistrationModal: React.FC<FarmerRegistrationModalProps> = ({
  lang,
  isOpen,
  onClose,
  onRegister,
}) => {
  const t = translations[lang];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    aadhaar: "",
    state: "Uttar Pradesh",
    district: "Baghpat",
    village: "",
    landSizeAcres: "5.0",
    cropType: "Wheat" as Farmer["cropType"],
    bankAccount: "",
    ifscCode: "SBIN0001842",
  });

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const newFarmer: Farmer = {
      id: `FARM-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      phone: formData.phone.startsWith("+91") ? formData.phone : `+91 ${formData.phone}`,
      aadhaar: formData.aadhaar ? `XXXX-XXXX-${formData.aadhaar.slice(-4)}` : "XXXX-XXXX-8821",
      state: formData.state,
      district: formData.district,
      village: formData.village || "Gram Panchayat Yard",
      landSizeAcres: parseFloat(formData.landSizeAcres) || 4.5,
      cropType: formData.cropType,
      bankAccount: formData.bankAccount || "38291049281",
      ifscCode: formData.ifscCode || "SBIN0001842",
      verified: true,
    };

    onRegister(newFarmer);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-beige-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-beige-200 rounded-2xl max-w-lg w-full p-6 shadow-glass relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-beige-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-wheat-200 text-beige-900 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-beige-900 leading-none">
                {t.regTitle}
              </h3>
              <p className="text-xs text-beige-600 mt-1">{t.regDesc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-beige-500 hover:text-beige-900 hover:bg-beige-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-leaf-600 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-beige-900">{t.regSuccessMsg}</h4>
            <p className="text-xs text-beige-600">SMS confirmation dispatched to {formData.phone}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-beige-800 mb-1">{t.fieldName} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wheat-500 text-beige-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-beige-800 mb-1">{t.fieldPhone} *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wheat-500 text-beige-900 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-beige-800 mb-1">{t.fieldAadhaar}</label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="12 Digit Aadhaar No"
                  value={formData.aadhaar}
                  onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                  className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wheat-500 text-beige-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-beige-800 mb-1">{t.fieldCrop}</label>
                <select
                  value={formData.cropType}
                  onChange={(e) => setFormData({ ...formData, cropType: e.target.value as Farmer["cropType"] })}
                  className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wheat-500 text-beige-900 font-medium"
                >
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Paddy">Paddy (धान)</option>
                  <option value="Pulses">Pulses (दालें)</option>
                  <option value="Mustard">Mustard (सरसों)</option>
                  <option value="Maize">Maize (मक्का)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-beige-800 mb-1">{t.fieldDistrict}</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl text-beige-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-beige-800 mb-1">{t.fieldVillage}</label>
                <input
                  type="text"
                  placeholder="Village Name"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl text-beige-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-beige-800 mb-1">{t.fieldLand}</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.landSizeAcres}
                  onChange={(e) => setFormData({ ...formData, landSizeAcres: e.target.value })}
                  className="w-full px-3 py-2 bg-beige-50 border border-beige-300 rounded-xl text-beige-900 font-medium"
                />
              </div>
            </div>

            {/* DBT Bank Details */}
            <div className="bg-wheat-50 p-3 rounded-xl border border-wheat-200 space-y-2">
              <div className="flex items-center gap-1.5 text-wheat-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-leaf-600" />
                <span>Direct Benefit Transfer (DBT) Bank Account</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Bank Account Number"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-wheat-300 rounded-lg text-beige-900 font-medium"
                />
                <input
                  type="text"
                  placeholder="IFSC Code"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-wheat-300 rounded-lg text-beige-900 font-medium uppercase"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-beige-100 text-beige-700 font-semibold hover:bg-beige-200"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-beige-900 text-beige-50 font-semibold hover:bg-beige-800 shadow-sm"
              >
                {t.btnSubmitRegistration}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
