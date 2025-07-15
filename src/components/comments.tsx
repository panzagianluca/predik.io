"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Comment, CreateCommentData } from '@/types/comment';
import { MessageCircle, ThumbsUp, ThumbsDown, Reply, Send, User } from 'lucide-react';
import { addToast } from '@/components/ui/toast';

interface CommentsProps {
  marketId: number;
}

// Mock comments data
const mockComments: Comment[] = [
  // Market 3 - Dólar comments
  {
    id: '1',
    marketId: 3,
    userId: 'user1',
    userName: 'Carlos Rodriguez',
    content: 'Creo que el dólar va a seguir subiendo por la incertidumbre política. La gente se refugia en dólares cuando hay inestabilidad.',
    createdAt: '2024-01-20T10:30:00Z',
    likes: 12,
    dislikes: 2,
    userVote: null
  },
  {
    id: '2',
    marketId: 3,
    userId: 'user2',
    userName: 'María González',
    content: 'No estoy de acuerdo. El gobierno está tomando medidas para estabilizar la economía. Creo que el dólar se va a estabilizar.',
    createdAt: '2024-01-20T11:15:00Z',
    likes: 8,
    dislikes: 5,
    userVote: 'like',
    replies: [
      {
        id: '3',
        marketId: 3,
        userId: 'user3',
        userName: 'Juan Pérez',
        parentId: '2',
        content: '¿Qué medidas específicas? No veo que hayan funcionado hasta ahora.',
        createdAt: '2024-01-20T11:45:00Z',
        likes: 3,
        dislikes: 1,
        userVote: null
      }
    ]
  },
  {
    id: '4',
    marketId: 3,
    userId: 'user4',
    userName: 'Ana López',
    content: 'Históricamente, en elecciones el dólar tiende a subir. Pero esta vez podría ser diferente si hay consenso político.',
    createdAt: '2024-01-20T14:20:00Z',
    likes: 15,
    dislikes: 1,
    userVote: null
  },
  
  // Market 1 - Milei reelection comments
  {
    id: '5',
    marketId: 1,
    userId: 'user5',
    userName: 'Roberto Fernández',
    content: 'Milei tiene mucho apoyo popular, pero falta mucho para 2027. Puede pasar cualquier cosa.',
    createdAt: '2024-01-21T09:00:00Z',
    likes: 20,
    dislikes: 8,
    userVote: null
  },
  {
    id: '6',
    marketId: 1,
    userId: 'user6',
    userName: 'Laura Martínez',
    content: 'Depende mucho de cómo le vaya con la economía. Si logra estabilizarla, tiene chances.',
    createdAt: '2024-01-21T10:30:00Z',
    likes: 15,
    dislikes: 3,
    userVote: null
  },
  
  // Market 4 - Messi goals comments
  {
    id: '7',
    marketId: 4,
    userId: 'user7',
    userName: 'Diego Maradona Jr',
    content: 'Messi va a llegar al Mundial 2026, está en gran forma. Pero hacer 3+ goles va a estar difícil.',
    createdAt: '2024-01-22T16:00:00Z',
    likes: 25,
    dislikes: 2,
    userVote: 'like'
  },
  {
    id: '8',
    marketId: 4,
    userId: 'user8',
    userName: 'Fútbol Fanático',
    content: '¡Están locos! Messi va a romperla en el Mundial. Apuesto a que hace 3+ goles fácil.',
    createdAt: '2024-01-22T17:15:00Z',
    likes: 12,
    dislikes: 8,
    userVote: null
  }
];

export function Comments({ marketId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Filter comments for this market
    const marketComments = mockComments.filter(comment => comment.marketId === marketId);
    setComments(marketComments);
  }, [marketId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    const timeout = setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        marketId,
        userId: 'current-user',
        userName: 'Usuario Actual',
        content: newComment,
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        userVote: null
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setIsSubmitting(false);
      
      if (typeof window !== 'undefined') {
        addToast({
          type: 'success',
          title: 'Comentario publicado',
          message: 'Tu comentario ha sido publicado exitosamente'
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    const timeout = setTimeout(() => {
      const reply: Comment = {
        id: Date.now().toString(),
        marketId,
        userId: 'current-user',
        userName: 'Usuario Actual',
        parentId,
        content: replyContent,
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        userVote: null
      };
      
      setComments(prev => prev.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply]
          };
        }
        return comment;
      }));
      
      setReplyContent('');
      setReplyingTo(null);
      setIsSubmitting(false);
      
      if (typeof window !== 'undefined') {
        addToast({
          type: 'success',
          title: 'Respuesta publicada',
          message: 'Tu respuesta ha sido publicada exitosamente'
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  };

  const handleVote = (commentId: string, voteType: 'like' | 'dislike') => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        const currentVote = comment.userVote;
        let newLikes = comment.likes;
        let newDislikes = comment.dislikes;
        let newUserVote: 'like' | 'dislike' | null = voteType;

        // Remove previous vote
        if (currentVote === 'like') newLikes--;
        if (currentVote === 'dislike') newDislikes--;

        // Add new vote or remove if same
        if (currentVote === voteType) {
          newUserVote = null;
        } else {
          if (voteType === 'like') newLikes++;
          if (voteType === 'dislike') newDislikes++;
        }

        return {
          ...comment,
          likes: newLikes,
          dislikes: newDislikes,
          userVote: newUserVote
        };
      }
      return comment;
    }));
  };

  const formatDate = (dateString: string) => {
    if (typeof window === 'undefined') return 'Hace un momento';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Hace unos minutos';
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-AR');
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Cargando comentarios...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="text-lg font-semibold">
          Comentarios ({comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)})
        </h3>
      </div>

      {/* New Comment Form */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-500" />
          </div>
          <div className="flex-1 space-y-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="¿Qué opinas sobre este mercado?"
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Publicando...' : 'Comentar'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Aún no hay comentarios. ¡Sé el primero en comentar!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Main Comment */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.userName}</span>
                      <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{comment.content}</p>
                    
                    {/* Comment Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleVote(comment.id, 'like')}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          comment.userVote === 'like' 
                            ? 'text-blue-600' 
                            : 'text-gray-500 hover:text-blue-600'
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        {comment.likes}
                      </button>
                      <button
                        onClick={() => handleVote(comment.id, 'dislike')}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          comment.userVote === 'dislike' 
                            ? 'text-red-600' 
                            : 'text-gray-500 hover:text-red-600'
                        }`}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        {comment.dislikes}
                      </button>
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <Reply className="h-4 w-4" />
                        Responder
                      </button>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-200">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-3 w-3 text-gray-500" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Escribe tu respuesta..."
                              className="w-full p-2 border border-gray-200 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <Button 
                                size="sm"
                                onClick={() => handleSubmitReply(comment.id)}
                                disabled={!replyContent.trim() || isSubmitting}
                              >
                                {isSubmitting ? 'Enviando...' : 'Responder'}
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyContent('');
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-3 w-3 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{reply.userName}</span>
                            <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                          </div>
                          <p className="text-gray-700 text-sm">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
