"use client";

interface CommentsProps {
  marketId: number;
}

export function CommentsSimple({ marketId }: CommentsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comentarios - Market {marketId}</h3>
      <div className="text-gray-600">
        Sistema de comentarios en desarrollo...
      </div>
    </div>
  );
}
