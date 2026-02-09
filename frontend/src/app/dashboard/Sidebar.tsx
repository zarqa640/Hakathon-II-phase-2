'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  Clock,
  Archive,
  Calendar,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/auth';

const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'AI Tasks', href: '/dashboard/ai-tasks', icon: Sparkles },
    { name: 'Add Task', href: '/dashboard/new', icon: PlusCircle },
    { name: 'Completed', href: '/dashboard/completed', icon: CheckCircle2 },
    { name: 'Pending', href: '/dashboard/pending', icon: Clock },
    { name: 'Archived', href: '/dashboard/archived', icon: Archive },
    { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 text-white flex flex-col fixed left-0 top-0 bottom-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <p className="text-xs text-slate-400">Pro Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
          Navigation
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {/* Active indicator glow */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-sm" />
                  )}
                  <Icon className={`h-5 w-5 relative z-10 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                  <span className="font-medium relative z-10">{item.name}</span>
                  {/* Soft glow on active */}
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-white rounded-full shadow-lg shadow-white/50" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-3">
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">User</h3>
            <p className="text-xs text-slate-400 truncate">Premium Member</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 py-3 rounded-xl transition-all duration-200 border border-white/5 hover:border-red-500/30"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
