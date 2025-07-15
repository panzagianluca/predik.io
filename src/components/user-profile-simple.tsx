"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { User } from '@/types/user';
import { 
  User as UserIcon, 
  Edit2,
  Calendar,
  Camera,
  Upload,
  X,
  Mail
} from 'lucide-react';

interface UserProfileProps {
  userId: string;
}

// Mock user data
const mockUser: User = {
  id: 'user1',
  username: 'predictor_arg',
  email: 'usuario@predik.io',
  fullName: 'Juan Carlos Martínez',
  avatar: undefined,
  avatarUrl: undefined,
  joinedAt: '2024-03-15T10:00:00Z',
  createdAt: '2024-03-15T10:00:00Z',
  lastActiveAt: '2024-07-16T14:30:00Z',
  balance: 1000,
  totalVolume: 5000,
  totalTrades: 47,
  totalProfit: 234.50,
  totalProfitLoss: 234.50,
  winRate: 68.1,
  currentStreak: 3,
  portfolioValue: 1247.80,
  level: 12,
  experience: 2850
};

export function UserProfile({ userId }: UserProfileProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedUser, setEditedUser] = useState(mockUser);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    try {
      // TODO: Implement save functionality including image upload
      console.log('Saving user data:', editedUser);
      if (selectedImage) {
        console.log('Uploading image:', selectedImage);
      }
      
      // Show success toast
      showToast({
        type: 'success',
        title: '¡Perfil actualizado!',
        message: 'Los cambios en tu perfil se han guardado correctamente.'
      });
      
      setShowEditModal(false);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      // Show error toast
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Hubo un error al actualizar tu perfil. Por favor, intenta nuevamente.'
      });
    }
  };

  const handleCancel = () => {
    setEditedUser(mockUser);
    setSelectedImage(null);
    setImagePreview(null);
    setShowEditModal(false);
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
            <p className="text-muted-foreground">
              Gestiona tu información personal y configuración de cuenta
            </p>
          </div>

          {/* User Info Card */}
          <div className="bg-card border rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-[rgb(var(--primary))] rounded-full flex items-center justify-center overflow-hidden">
                    {mockUser.avatarUrl ? (
                      <img 
                        src={mockUser.avatarUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-10 w-10 text-white" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold">{mockUser.fullName}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {mockUser.email}
                      </p>
                      <p className="text-muted-foreground">
                        @{mockUser.username}
                      </p>
                    </div>
                  </div>

                  {/* Google Account Tag and Member Since */}
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
                      <img 
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-gray-700">Cuenta de Google</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Miembro desde {new Date(mockUser.joinedAt).toLocaleDateString('es-AR', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" onClick={() => setShowEditModal(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Editar Perfil
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Total Trades</div>
              <div className="text-xl font-bold">
                {mockUser.totalTrades}
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Ganancia Total</div>
              <div className="text-xl font-bold text-green-600">
                +${mockUser.totalProfit}
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Tasa de Acierto</div>
              <div className="text-xl font-bold">
                {mockUser.winRate}%
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Valor Portfolio</div>
              <div className="text-xl font-bold">
                ${mockUser.portfolioValue}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={handleCancel}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Editar Perfil</h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <div className="w-20 h-20 bg-[rgb(var(--primary))] rounded-full flex items-center justify-center overflow-hidden">
                    {imagePreview || mockUser.avatarUrl ? (
                      <img 
                        src={imagePreview || mockUser.avatarUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-10 w-10 text-white" />
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 bg-[rgb(var(--primary))] rounded-full p-2 cursor-pointer hover:bg-[rgb(var(--primary))]/80 transition-colors">
                    <Camera className="h-4 w-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {selectedImage && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    <span>Nueva foto: {selectedImage.name}</span>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={editedUser.fullName}
                    onChange={(e) => setEditedUser({...editedUser, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent outline-none"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    value={editedUser.username}
                    onChange={(e) => setEditedUser({...editedUser, username: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent outline-none"
                    placeholder="username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={editedUser.email}
                      disabled
                      className="w-full px-3 py-2 border border-input rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <img 
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tu email está vinculado a tu cuenta de Google y no se puede cambiar
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-8">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/90">
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
