'use client';

import React from 'react';
import { User } from '@/types';
import { ProfileSidebar, ProfileTab } from './ProfileSidebar';

/**
 * ProfileLayout Component - Premium Netflix-style Layout
 */

export interface ProfileLayoutProps {
  user: User;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  user,
  activeTab,
  onTabChange,
  onLogout,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Mobile Header/Nav */}
      <div className="md:hidden sticky top-[60px] z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
        <ProfileSidebar
          user={user}
          activeTab={activeTab}
          onTabChange={onTabChange}
          onLogout={onLogout}
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8 md:py-10">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-60 lg:w-72 flex-shrink-0">
            <div className="sticky top-24">
              <ProfileSidebar
                user={user}
                activeTab={activeTab}
                onTabChange={onTabChange}
                onLogout={onLogout}
              />
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
