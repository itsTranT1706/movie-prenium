'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/shared/lib/api';
import type { RecentComment } from '@/shared/lib/api/services';

export default function RecentCommentsTest() {
  const [comments, setComments] = useState<RecentComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ success: boolean; data: RecentComment[] }>(
          '/comments/recent?limit=5'
        );
        setComments(response.data?.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) return <div className="p-4">Loading recent comments...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Recent Comments Test</h2>
      {comments.length === 0 ? (
        <p>No comments found</p>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => (
            <div key={comment.id} className="border p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{comment.user?.name || 'Anonymous'}</span>
                <span className="text-sm text-gray-500">
                  on {comment.movie?.title || 'Unknown Movie'}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(comment.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
