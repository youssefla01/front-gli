import React from 'react';
import { Building2 } from 'lucide-react';

interface LoadingScreenProps {
  tip?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ tip = 'Chargement...' }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white to-blue-50 z-50">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Logo avec animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
          <Building2 className="w-20 h-20 text-blue-900 relative animate-float" />
        </div>

        {/* Texte de chargement avec animation */}
        <div className="text-xl font-medium text-gray-700 mb-8 animate-fade-in">
          {tip}
        </div>

        {/* Indicateur de progression */}
        <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-900 rounded-full animate-progress" />
        </div>

        {/* Points de chargement */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-blue-900 animate-loading-dot"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;