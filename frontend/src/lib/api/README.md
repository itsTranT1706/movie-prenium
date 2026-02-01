# API Client Architecture

## Cấu trúc thư mục

```
lib/api/
├── base-client.ts          # Base class với logic HTTP request chung
├── client.ts               # Unified API client (entry point)
├── services/               # Các service modules theo domain
│   ├── auth.service.ts
│   ├── movie.service.ts
│   ├── favorite.service.ts
│   ├── recommendation.service.ts
│   ├── streaming.service.ts
│   ├── user.service.ts
│   └── index.ts
└── index.ts
```

## Lợi ích của kiến trúc mới

### 1. Tách biệt theo domain (Separation of Concerns)
Mỗi service chịu trách nhiệm cho một domain cụ thể:
- `AuthService`: Xác thực (login, register)
- `MovieService`: Quản lý phim (search, popular, details, etc.)
- `FavoriteService`: Yêu thích
- `RecommendationService`: Gợi ý
- `StreamingService`: Streaming
- `UserService`: Người dùng

### 2. Dễ bảo trì và mở rộng
- Thêm endpoint mới? Chỉ cần sửa service tương ứng
- Thêm domain mới? Tạo service mới kế thừa `BaseApiClient`
- Không làm ảnh hưởng đến các module khác

### 3. Dễ test
```typescript
// Mock từng service riêng lẻ
jest.mock('@/lib/api/services/movie.service');
```

### 4. Code reuse
`BaseApiClient` chứa logic chung:
- Token management
- HTTP request handling
- Error handling

### 5. Backward compatible
API client vẫn giữ nguyên interface cũ:
```typescript
import { apiClient } from '@/lib/api/client';

// Vẫn dùng như cũ
apiClient.login(email, password);
apiClient.getPopularMovies();
```

## Cách sử dụng

### Import và sử dụng (giống như cũ)
```typescript
import { apiClient } from '@/lib/api/client';

// Auth
const result = await apiClient.login('email@example.com', 'password');

// Movies
const movies = await apiClient.getPopularMovies(1);
const details = await apiClient.getMovieDetails('movie-slug');

// Favorites
const favorites = await apiClient.getFavorites();
```

### Sử dụng service riêng lẻ (nếu cần)
```typescript
import { MovieService } from '@/lib/api/services';

const movieService = new MovieService(BASE_URL);
movieService.setToken(token);
const movies = await movieService.getPopularMovies();
```

## Thêm endpoint mới

### Ví dụ: Thêm endpoint xóa favorite

1. Mở `services/favorite.service.ts`
2. Thêm method:
```typescript
async removeFavorite(movieId: string) {
  return this.request<void>(`/favorites/${movieId}`, { method: 'DELETE' });
}
```

3. Export trong `client.ts`:
```typescript
export const apiClient = {
  // ...
  removeFavorite: favoriteService.removeFavorite.bind(favoriteService),
};
```

## Thêm service mới

### Ví dụ: Thêm CommentService

1. Tạo `services/comment.service.ts`:
```typescript
import BaseApiClient from '../base-client';
import { Comment } from '@/types';

class CommentService extends BaseApiClient {
  async getComments(movieId: string) {
    return this.request<Comment[]>(`/comments/${movieId}`);
  }

  async addComment(movieId: string, content: string) {
    return this.request<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify({ movieId, content }),
    });
  }
}

export default CommentService;
```

2. Export trong `services/index.ts`:
```typescript
export { default as CommentService } from './comment.service';
```

3. Khởi tạo và export trong `client.ts`:
```typescript
import { CommentService } from './services';

const commentService = new CommentService(BASE_URL);

export const apiClient = {
  // ...
  getComments: commentService.getComments.bind(commentService),
  addComment: commentService.addComment.bind(commentService),
};
```
