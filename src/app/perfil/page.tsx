"use client";

import { UserProfile } from '@/components/user-profile';
import { useAuth } from '../../../lib/auth/AuthProvider';

export default function PerfilPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Debes iniciar sesión para ver tu perfil</p>
        </div>
      </div>
    );
  }

  return <UserProfile userId={user.id} />;
}
