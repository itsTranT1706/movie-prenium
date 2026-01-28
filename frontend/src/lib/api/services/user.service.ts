import BaseApiClient from '../base-client';
import { User } from '@/types';

export interface UpdateProfileData {
  name?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class UserService extends BaseApiClient {
  async getUser(userId: string) {
    return this.request<User>(`/users/${userId}`);
  }

  async updateProfile(userId: string, data: UpdateProfileData) {
    return this.request<{ success: boolean; data: User }>(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async changePassword(userId: string, data: ChangePasswordData) {
    return this.request<{ success: boolean; message: string }>(`/users/${userId}/password`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export default UserService;
