import BaseApiClient from '../base-client';
import { User } from '@/types';

class UserService extends BaseApiClient {
  async getUser(userId: string) {
    return this.request<User>(`/users/${userId}`);
  }
}

export default UserService;
