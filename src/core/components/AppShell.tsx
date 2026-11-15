"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Code2,
  Compass,
  Crown,
  Flame,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Palette,
  PawPrint,
  Settings,
  ShoppingBag,
  Sparkles,
  Swords,
  Users,
  X,
} from "lucide-react";
import { BRAND_NAME, BRAND_SUBTITLE, PLATFORM_FOOTER } from "@/core/config/brand";
import { getAvatar } from "@/core/avatars";
import { getProfileFrame } from "@/core/config/shop";
import { getPlayerLevelInfo } from "@/core/grading/level";
import type { PlatformClientState } from "@/core/platform/types";
import { PlatformStateProvider, usePlatformState } from "@/core/components/PlatformStateProvider";
import { FloatingPetWidget } from "@/core/components/FloatingPetWidget";

export type NavSectionKey =
  | "home"
  | "courses"
  | "lessons"
  | "lab"
  | "adventure"
  | "arena"
  | "progress"
  | "loom"
  | "shop"
  | "pets"
  | "dashboard"
  | "teacher"
  | "admin"
  | "design";

interface AppShellProps {
  initialState: PlatformClientState;
  activePath: NavSectionKey;
  semesterLabel?: string | null;
  devAuthEnabled?: boolean;
  hidePetWidget?: boolean;
  children: React.ReactNode;
}

export function SchoolCrestLogo({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="pccpl-crest-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#1364E7" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="11" fill="url(#pccpl-crest-grad)" />
      <path
        d="M15 14L10 20L15 26M25 14L30 20L25 26M22 12L18 28"
        stroke="#FFFFFF"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShellInner({
  activePath,
  semesterLabel,
  devAuthEnabled = false,
  hidePetWidget = false,
  children,
}: Omit<AppShellProps, "initialState">) {
  const { state } = usePlatformState();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [devLogging, setDevLogging] = useState<string | null>(null);

  const levelInfo = getPlayerLevelInfo(state.xp);
  const avatar = getAvatar(state.avatarKey);
  const frame = getProfileFrame(state.equippedFrameKey);

  const learningItems: {
    key: NavSectionKey;
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { key: "home", href: "/", label: "หน้าแรก", icon: Home },
    { key: "courses", href: "/courses", label: "รายวิชา ม.1–ม.3", icon: BookOpen },
    { key: "lessons", href: "/lessons", label: "บทเรียน Interactive", icon: Sparkles },
    { key: "lab", href: "/lab", label: "Coding Lab", icon: Code2 },
    { key: "adventure", href: "/adventure", label: "แผนที่ล่าสมบัติ", icon: Compass },
    { key: "arena", href: "/arena", label: "Code Arena", icon: Swords },
    { key: "progress", href: "/progress", label: "ความก้าวหน้า", icon: Award },
    { key: "loom", href: "/loom", label: "ห้องเรียนของฉัน", icon: Users },
  ];

  const rewardItems: {
    key: NavSectionKey;
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { key: "shop", href: "/shop", label: "ร้านค้าของคุณเหมียว", icon: ShoppingBag },
    { key: "pets", href: "/pets", label: "สัตว์เลี้ยงของฉัน", icon: PawPrint },
  ];

  const staffItems: {
    key: NavSectionKey;
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { key: "dashboard", href: "/dashboard", label: "ห้องเรียน & ตรวจงาน", icon: LayoutDashboard },
    ...(state.role === "admin"
      ? [{ key: "admin" as const, href: "/admin", label: "จัดการระบบโรงเรียน", icon: Settings }]
      : []),
    { key: "design", href: "/design", label: "คู่มือ UI System", icon: Palette },
  ];

  const quickDevLogin = async (role: "student" | "teacher" | "admin") => {
    setDevLogging(role);
    try {
      const res = await fetch("/api/auth/dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } finally {
      setDevLogging(null);
    }
  };

  const renderNavLink = (item: {
    key: NavSectionKey;
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => {
    const active = item.key === activePath;
    const Icon = item.icon;
    return (
      <Link
        key={item.key}
        href={item.href}
        onClick={() => setMobileOpen(false)}
        title={collapsed ? item.label : undefined}
        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
          active
            ? "bg-gradient-to-r from-[#1364E7] to-[#227FF5] text-white shadow-[0_6px_18px_rgba(19,100,231,0.38)]"
            : "text-[#C2D2EE] hover:bg-white/10 hover:text-white"
        } ${collapsed ? "justify-center px-2" : ""}`}
      >
        <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-white" : "text-[#8BA9DA] group-hover:text-white"}`} />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 text-[#E4EDFF]">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} gap-2`}>
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <SchoolCrestLogo size={36} />
            {!collapsed && (
              <div className="min-w-0">
                <div className="font-display truncate text-base font-semibold tracking-tight text-white">
                  {BRAND_NAME}
                </div>
                <div className="truncate text-[10px] font-medium text-[#8BA9DA]">
                  {BRAND_SUBTITLE}
                </div>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="hidden rounded-lg p-1.5 text-[#8BA9DA] hover:bg-white/10 hover:text-white lg:inline-flex"
            aria-label={collapsed ? "ขยายเมนู" : "ย่อเมนู"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-[#8BA9DA] hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="ปิดเมนู"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* LEARNING */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-[#6D8BC0]">
              LEARNING
            </div>
          )}
          <nav className="space-y-1">{learningItems.map(renderNavLink)}</nav>
        </div>

        {/* REWARDS */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-[#6D8BC0]">
              REWARDS
            </div>
          )}
          <nav className="space-y-1">{rewardItems.map(renderNavLink)}</nav>
        </div>

        {/* TEACHER / ADMIN */}
        {(state.role === "teacher" || state.role === "admin") && (
          <div className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-amber-300/80">
                TEACHER & ADMIN
              </div>
            )}
            <nav className="space-y-1">{staffItems.map(renderNavLink)}</nav>
          </div>
        )}
      </div>

      {/* Bottom Mini Status / Dev Switcher */}
      <div className="space-y-2 border-t border-white/10 pt-3">
        {!collapsed && state.role === "guest" && (
          <div className="rounded-xl bg-white/8 p-3 text-xs text-[#C2D2EE]">
            <div className="font-semibold text-white">โหมดทดลองเรียน (Guest)</div>
            <p className="mt-0.5 text-[11px] text-[#9FB8E3]">
              ลองเรียนและรันโค้ดได้ทันที เข้าสู่ระบบด้วย @pccpl.ac.th เพื่อเก็บคะแนนจริง
            </p>
            {devAuthEnabled && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {(["student", "teacher", "admin"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    disabled={devLogging !== null}
                    onClick={() => quickDevLogin(r)}
                    className="rounded-lg bg-white/15 px-2 py-1 text-[10px] font-semibold text-white hover:bg-white/25"
                  >
                    {devLogging === r ? "..." : `Dev:${r}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {!collapsed && (
          <div className="px-2 text-[11px] text-[#6D8BC0]">
            {BRAND_NAME} · ม.1–ม.3
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F4F7FD] text-[#11264A]">
      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`ed-sidebar sticky top-0 hidden h-screen shrink-0 transition-[width] duration-200 lg:block ${
          collapsed ? "w-[78px]" : "w-[254px]"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-[#06152E]/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="ed-sidebar relative z-10 h-full w-[264px] overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Sticky 68px White Topbar */}
        <header className="ed-topbar sticky top-0 z-30 flex h-[68px] items-center justify-between gap-3 border-b border-[#E1EAFB] px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E1EAFB] bg-white text-[#092551] hover:bg-[#F4F7FD] lg:hidden"
              aria-label="เปิดเมนู"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D6E8FC] bg-[#F4FBFF] px-3 py-1 text-xs font-semibold text-[#0A5FE6]">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                <span>{semesterLabel || "โหมดทดลองเรียน · ม.1–ม.3"}</span>
              </span>
              {state.roomName && (
                <span className="rounded-full border border-[#E1EAFB] bg-white px-3 py-1 text-xs font-semibold text-[#11264A]">
                  {state.roomName}
                  {state.studentNumber ? ` · เลขที่ ${state.studentNumber}` : ""}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Coins Counter */}
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100"
              title="กระเป๋า Coins และร้านค้าคุณเหมียว"
            >
              <span>🪙</span>
              <span>{state.coins.toLocaleString()}</span>
            </Link>

            {/* Level Pill */}
            <Link
              href="/progress"
              className={`hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold sm:inline-flex ${levelInfo.rankBadgeClass}`}
              title={`ความก้าวหน้าและยศ: ${levelInfo.rankTitle}`}
            >
              <Crown className="h-3.5 w-3.5" />
              <span>LV {levelInfo.level}</span>
            </Link>

            {state.authenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/progress"
                  className="flex items-center gap-2 rounded-full border border-[#E1EAFB] bg-white p-1 pr-3 hover:border-[#C2D8FA]"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${avatar.gradient} text-sm text-white ${frame.ringClass}`}
                  >
                    {avatar.emoji}
                  </span>
                  <span className="hidden max-w-[140px] truncate text-xs font-semibold text-[#092551] sm:inline">
                    {state.fullName}
                  </span>
                </Link>

                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    title="ออกจากระบบ"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E1EAFB] bg-white text-[#5C7299] hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/api/auth/google" className="ed-btn-primary !min-h-10 !px-4 !text-xs sm:!text-sm">
                <span>เข้าสู่ระบบ →</span>
              </Link>
            )}
          </div>
        </header>

        {/* Main Workspace */}
        <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-6 sm:px-7 sm:py-7">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#E1EAFB] bg-white/60 px-6 py-4 text-center text-xs text-[#7485A4]">
          {PLATFORM_FOOTER}
        </footer>
      </div>

      {!hidePetWidget && <FloatingPetWidget />}
    </div>
  );
}

export function AppShell(props: AppShellProps) {
  return (
    <PlatformStateProvider initialState={props.initialState}>
      <ShellInner
        activePath={props.activePath}
        semesterLabel={props.semesterLabel}
        devAuthEnabled={props.devAuthEnabled}
        hidePetWidget={props.hidePetWidget}
      >
        {props.children}
      </ShellInner>
    </PlatformStateProvider>
  );
}
