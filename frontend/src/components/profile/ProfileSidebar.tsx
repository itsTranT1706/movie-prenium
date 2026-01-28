'use client';

import React from 'react';
import { User } from '@/types';
import {
  Play,
  Heart,
  Clock,
  Settings,
  LogOut
} from 'lucide-react';

/**
 * ProfileSidebar Component - Premium Netflix-style Navigation
 */

export type ProfileTab = 'continue-watching' | 'favorites' | 'history' | 'settings';

export interface NavigationItem {
  id: ProfileTab;
  label: string;
  icon: React.ReactNode;
}

export interface ProfileSidebarProps {
  user: User;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  onLogout: () => void;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'continue-watching',
    label: 'Đang xem',
    icon: <Play className="w-5 h-5 fill-current" />,
  },
  {
    id: 'favorites',
    label: 'Danh sách của tôi',
    icon: <Heart className="w-5 h-5 fill-current" />,
  },
  {
    id: 'history',
    label: 'Lịch sử xem',
    icon: <Clock className="w-5 h-5" />,
  },
  {
    id: 'settings',
    label: 'Cài đặt tài khoản',
    icon: <Settings className="w-5 h-5" />,
  },
];

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
}) => {
  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col gap-1 w-full">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                group flex items-center gap-4 px-4 py-3 text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'text-white border-l-4 border-[#e50914]'
                  : 'text-gray-400 hover:text-white border-l-4 border-transparent hover:border-white/10'
                }
              `}
            >
              <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="my-4 border-t border-white/10" />

        <button
          onClick={onLogout}
          className="flex items-center gap-4 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white border-l-4 border-transparent transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </nav>

      {/* Mobile horizontal menu */}
      <div className="md:hidden w-full overflow-x-auto scrollbar-hide">
        <div className="flex px-4 py-2 gap-2 min-w-max">
          {navigationItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  ${isActive
                    ? 'bg-white text-black'
                    : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a] hover:text-white border border-white/10'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
