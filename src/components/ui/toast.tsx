"use client";

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export interface ToastData {
  id: string;
  type: 'success' | 'error';
  title: string;
  message: string;
  duration?: number;
}

interface ToastProps extends ToastData {
  onCloseAction: (id: string) => void;
}

export function Toast({ id, type, title, message, duration = 4000, onCloseAction }: ToastProps) {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 100));
        if (newProgress <= 0) {
          setIsVisible(false);
          setTimeout(() => onCloseAction(id), 300); // Wait for fade out animation
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, id, onCloseAction]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onCloseAction(id), 300);
  };

  return (
    <div 
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-96 max-w-[90vw] transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className={`relative rounded-lg shadow-lg border-l-4 bg-white ${
        type === 'success' ? 'border-l-green-500' : 'border-l-red-500'
      }`}>
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-lg overflow-hidden">
          <div 
            className={`h-full transition-all duration-100 ease-linear ${
              type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            
            <div className="ml-3 flex-1">
              <h3 className={`text-sm font-medium ${
                type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {title}
              </h3>
              <p className={`mt-1 text-sm ${
                type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {message}
              </p>
            </div>

            <button
              onClick={handleClose}
              className="ml-4 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple toast manager without React Context
let toastCounter = 0;
const toastListeners: Array<(toasts: ToastProps[]) => void> = [];
let currentToasts: ToastProps[] = [];

function notifyListeners() {
  toastListeners.forEach(listener => listener([...currentToasts]));
}

export function addToast(toast: Omit<ToastData, 'id'>) {
  const id = `toast-${++toastCounter}`;
  const newToast: ToastProps = {
    ...toast,
    id,
    onCloseAction: removeToast,
  };
  
  currentToasts.push(newToast);
  notifyListeners();
}

function removeToast(id: string) {
  currentToasts = currentToasts.filter(toast => toast.id !== id);
  notifyListeners();
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    const listener = (newToasts: ToastProps[]) => {
      setToasts(newToasts);
    };
    
    toastListeners.push(listener);
    
    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) {
        toastListeners.splice(index, 1);
      }
    };
  }, []);

  return {
    toasts,
    showToast: addToast
  };
}

export function ToastContainer() {
  const { toasts } = useToast();
  
  return (
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </>
  );
}
