"use client";

import React, { useState } from "react";
import { Language, UserRole } from "@/lib/types";
import { translations } from "@/lib/translations";
import { motion } from "framer-motion";
import { Sprout, Bell, Languages, ShieldCheck, Building2, Sparkles, RefreshCw, ChevronDown } from "lucide-react";

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  smsCount: number;
  onOpenSms: () => void;
  onOpenRegister: () => void;
  onSeedDemoData?: () => void;
  onClearData?: () => void;
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onRunDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  activeTab,
  setActiveTab,
  smsCount,
  onOpenSms,
  onOpenRegister,
  onSeedDemoData,
  onClearData,
  currentRole = "farmer",
  onRoleChange,
  onRunDemo,
}) => {
  const t = translations[lang];
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navItems = [
    { id: "overview", label: t.navOverview },
    { id: "book-slot", label: t.navBookSlot },
    { id: "queue", label: t.navQueue },
    { id: "procurement", label: t.navProcurement },
    { id: "centers", label: t.navCenters },
    { id: "admin", label: t.navAdmin },
  ];

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "operator":
        return "Centre Operator";
      case "admin":
        return "System Admin";
      default:
        return "Farmer";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full beige-glass border-b border-beige-200 shadow-soft">
      
      {/* Top Official Government Banner Strip */}
      <div className="bg-beige-900 text-beige-100 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap justify-between items-center border-b border-beige-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-amber-300 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{t.govEmblem}</span>
          </div>
          <span className="hidden md:inline text-beige-400">|</span>
          <div className="hidden md:flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-wheat-500" />
            <span className="font-medium tracking-wide">{t.ministry} • {t.department}</span>
          </div>
          <span className="ml-2 bg-amber-900/60 text-amber-200 px-2 py-0.5 rounded text-[10px] font-semibold border border-amber-700">
            SIH 2026 • DEMO
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-100 hover:text-white px-2.5 py-0.5 rounded border border-amber-500/50 bg-amber-900/60 transition-colors"
            >
              <span className="hidden sm:inline">Role:</span>
              <span className="font-bold">{getRoleLabel(currentRole)}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {roleDropdownOpen && (
              <div className="absolute top-full mt-1 right-0 bg-beige-800 border border-beige-700 rounded-lg shadow-lg z-50 min-w-40">
                {(["farmer", "operator", "admin"] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange?.(role);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                      currentRole === role
                        ? "bg-amber-700 text-white"
                        : "text-beige-200 hover:bg-beige-700"
                    }`}
                  >
                    {getRoleLabel(role)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {onSeedDemoData && (
            <button
              onClick={onSeedDemoData}
              className="flex items-center gap-1 text-[11px] font-semibold text-amber-300 hover:text-white px-2 py-0.5 rounded border border-amber-500/40 bg-amber-900/40 transition-colors"
              title="Load demo scenario"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Load Demo</span>
            </button>
          )}

          {onRunDemo && (
            <button
              onClick={onRunDemo}
              className="flex items-center gap-1 text-[11px] font-semibold text-leaf-300 hover:text-white px-2 py-0.5 rounded border border-leaf-500/40 bg-leaf-900/40 transition-colors"
              title="Auto-run demo workflow"
            >
              <RefreshCw className="w-3 h-3 text-leaf-400" />
              <span className="hidden sm:inline">Run Demo</span>
            </button>
          )}

          {onClearData && (
            <button
              onClick={onClearData}
              className="text-[11px] font-medium text-beige-400 hover:text-white transition-colors"
              title="Reset all data"
            >
              Reset
            </button>
          )}

          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 hover:text-wheat-500 transition-colors font-medium px-2 py-0.5 rounded border border-beige-700 bg-beige-800/60"
          >
            <Languages className="w-3.5 h-3.5 text-wheat-500" />
            <span className="hidden sm:inline">{t.langSwitch}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Government Emblem */}
        <div 
          onClick={() => setActiveTab("overview")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-beige-600 via-amber-800 to-wheat-700 flex items-center justify-center shadow-sm text-beige-50 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-beige-900 tracking-tight leading-none">
                {t.appName}
              </h1>
              <span className="bg-leaf-100 text-leaf-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-leaf-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> DoCA Portal
              </span>
            </div>
            <p className="text-xs text-beige-600 font-medium mt-0.5">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Desktop Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-beige-100/80 p-1 rounded-xl border border-beige-200">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? "bg-white text-beige-900 shadow-sm border border-beige-200 font-bold"
                    : "text-beige-700 hover:text-beige-900 hover:bg-white/50"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-white rounded-lg border border-beige-200 shadow-xs -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSms}
            className="relative p-2 rounded-xl bg-white border border-beige-200 text-beige-700 hover:text-beige-900 hover:border-beige-300 shadow-sm transition-all"
            title={t.smsTitle}
          >
            <Bell className="w-4 h-4" />
            {smsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-leaf-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {smsCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenRegister}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-beige-900 text-beige-50 text-xs font-semibold hover:bg-beige-800 transition-colors shadow-sm"
          >
            <span>{t.btnRegisterFarmer}</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-nav */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 bg-beige-100/60 border-t border-beige-200 gap-1.5 scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`whitespace-nowrap px-3 py-1 text-xs font-medium rounded-lg ${
              activeTab === item.id
                ? "bg-white text-beige-900 font-semibold border border-beige-300"
                : "text-beige-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
