'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { Save, Loader2, Shield, User as UserIcon } from 'lucide-react';
import { toast } from "sonner";

/**
 * AccountSettingsSection Component - Premium Netflix Design
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6
 */

export interface ProfileUpdate {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AccountSettingsSectionProps {
  user: User;
  onUpdateProfile: (data: ProfileUpdate) => Promise<void>;
  onChangePassword: (data: PasswordChange) => Promise<void>;
}

export const AccountSettingsSection: React.FC<AccountSettingsSectionProps> = ({
  user,
  onUpdateProfile,
  onChangePassword,
}) => {
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user.name || '',
    email: user.email,
    avatar: user.avatar || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Handle profile update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess(false);

    if (!profileForm.name.trim()) {
      toast.error('Tên không được để trống');
      return;
    }

    setProfileLoading(true);
    try {
      // Only send name and avatar (email is read-only)
      await onUpdateProfile({
        name: profileForm.name,
        avatar: profileForm.avatar,
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (error) {
      toast.error('Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordForm.currentPassword) {
      toast.error('Vui lòng nhập mật khẩu hiện tại');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');

      return;
    }

    setPasswordLoading(true);
    try {
      await onChangePassword(passwordForm);
      setPasswordSuccess(true);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      toast.error('Đổi mật khẩu thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Cài đặt tài khoản</h2>
        <p className="text-gray-400">Quản lý thông tin và bảo mật</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Section */}
        <section className="bg-[#141414] rounded-lg border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="p-2 rounded bg-white/5 text-white">
              <UserIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Thông tin cá nhân</h3>
          </div>

          <div className="p-6 md:p-8">
            <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Tên hiển thị
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full h-12 px-4 bg-[#2a2a2a] border border-transparent focus:border-[#e50914] focus:ring-0 rounded text-white transition-colors outline-none placeholder:text-gray-600"
                    placeholder="Nhập tên của bạn"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    disabled
                    className="w-full h-12 px-4 bg-[#1a1a1a] border border-transparent text-gray-500 rounded cursor-not-allowed"
                    placeholder="email@example.com"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Email không thể thay đổi
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-300 mb-2">
                  Avatar URL
                </label>
                <input
                  id="avatar"
                  type="url"
                  value={profileForm.avatar}
                  onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                  className="w-full h-12 px-4 bg-[#2a2a2a] border border-transparent focus:border-[#e50914] focus:ring-0 rounded text-white transition-colors outline-none placeholder:text-gray-600"
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Dán đường dẫn ảnh để thay đổi avatar của bạn
                </p>
              </div>

              {profileError && (
                <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {profileError}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="inline-flex items-center gap-2 h-10 px-6 bg-white hover:bg-gray-200 text-black font-semibold rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {profileLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-[#141414] rounded-lg border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="p-2 rounded bg-white/5 text-white">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Bảo mật & Mật khẩu</h3>
          </div>

          <div className="p-6 md:p-8">
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-2xl">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full h-12 px-4 bg-[#2a2a2a] border border-transparent focus:border-[#e50914] focus:ring-0 rounded text-white transition-colors outline-none placeholder:text-gray-600"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full h-12 px-4 bg-[#2a2a2a] border border-transparent focus:border-[#e50914] focus:ring-0 rounded text-white transition-colors outline-none placeholder:text-gray-600"
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full h-12 px-4 bg-[#2a2a2a] border border-transparent focus:border-[#e50914] focus:ring-0 rounded text-white transition-colors outline-none placeholder:text-gray-600"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
              </div>
     
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="inline-flex items-center gap-2 h-10 px-6 bg-transparent border border-gray-600 hover:border-white text-gray-300 hover:text-white font-medium rounded transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? (
                    'Đang xử lý...'
                  ) : (
                    'Cập nhật mật khẩu'
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};
