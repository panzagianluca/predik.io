export interface Comment {
  id: string;
  marketId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  dislikes: number;
  userVote?: 'like' | 'dislike' | null;
  replies?: Comment[];
  parentId?: string;
}

export interface CreateCommentData {
  marketId: number;
  content: string;
  parentId?: string;
}
