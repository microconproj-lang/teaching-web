import Link from "next/link";
import { BookOpen, Code2, Home, LayoutDashboard, LogOut, ShieldCheck, Users } from "lucide-react";
import type { SessionUser } from "@/core/auth/session";
import { BRAND_NAME } from "@/core/config/brand";
import { DEFAULT_AVATAR_KEY } from "@/core/avatars";
import { AvatarEmblem } from "@/core/components/AvatarEmblem";

interface WeaveNavProps {
  session: SessionUser;
  activePath: "dashboard" | "portfolio" | "loom" | "teacher" | "admin" | "worlds";
  semesterLabel?: string | null;
  totalXp?: number;
  avatarKey?: string | null;
  surface?: string;
}

export function WeaveNav({
  session,
  activePath,
  semesterLabel,
  totalXp,
  avatarKey = DEFAULT_AVATAR_KEY,
}: WeaveNavProps) {
  const navItems = [
    { href: "/", key: "home", label: "หน้าหลักแพลตฟอร์ม", icon: Home },
    { href: "/dashboard", key: "dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
    { href: "/courses", key: "courses", label: "หลักสูตร ม.1–ม.3", icon: BookOpen },
    { href: "/loom", key: "loom", label: "ห้องเรียน", icon: Users },
    ...(session.role === "admin"
      ? [{ href: "/admin", key: "admin", label: "ผู้ดูแลระบบ", icon: ShieldCheck }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[#16366C] bg-gradient-to-r from-[#071B3B] via-[#0A2857] to-[#06152E] text-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#227FF5] to-[#1364E7] text-white shadow-sm">
              <Code2 className="h-5 w-5" />
            </span>
            <div>
              <div className="font-display text-base font-bold leading-tight text-white">
                {BRAND_NAME}
              </div>
              {semesterLabel && (
                <div className="text-[11px] font-medium text-sky-200/80">{semesterLabel}</div>
              )}
            </div>
          </Link>

          <nav className="ml-2 hidden flex-wrap items-center gap-1 lg:flex" aria-label="เมนูหลัก">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePath === item.key;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-[#1364E7] text-white shadow-xs"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          {typeof totalXp === "number" && (
            <Link
              href="/progress"
              className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-amber-300 ring-1 ring-white/15 hover:bg-white/20"
            >
              <span>{totalXp} XP</span>
            </Link>
          )}

          <Link
            href="/portfolio"
            title={session.fullName}
            className="hidden items-center gap-2 rounded-xl bg-white/10 px-2.5 py-1 hover:bg-white/15 sm:inline-flex"
          >
            <AvatarEmblem avatarKey={avatarKey} size={30} />
            <span className="max-w-32 truncate text-xs font-semibold text-white">
              {session.fullName}
            </span>
          </Link>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>ออก</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
