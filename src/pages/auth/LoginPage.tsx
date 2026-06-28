import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { School, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/auth.store';
import type { UserRole } from '../../types';

const roleLabels: Record<UserRole, string> = {
  super_admin: 'Super Administrateur',
  admin_etablissement: 'Administrateur Établissement',
  enseignant: 'Enseignant',
  parent: 'Parent',
  apprenant: 'Apprenant',
};

const roleDescriptions: Record<UserRole, string> = {
  super_admin: 'Accès complet à toutes les fonctionnalités et tous les établissements',
  admin_etablissement: 'Gestion complète de votre établissement',
  enseignant: 'Gestion des classes, notes et présences',
  parent: 'Suivi de la scolarité de vos enfants',
  apprenant: 'Accès à votre espace personnel et résultats',
};

const roleColors: Record<UserRole, string> = {
  super_admin: 'from-error-500 to-error-600',
  admin_etablissement: 'from-primary-500 to-primary-600',
  enseignant: 'from-accent-500 to-accent-600',
  parent: 'from-warning-500 to-warning-600',
  apprenant: 'from-secondary-500 to-secondary-600',
};

export function LoginPage() {
  const navigate = useNavigate();
  const { loginAsRole } = useAuthStore();
  const [mode, setMode] = useState<'select' | 'login'>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles: UserRole[] = ['super_admin', 'admin_etablissement', 'enseignant', 'parent', 'apprenant'];

  const handleQuickLogin = (role: UserRole) => {
    loginAsRole(role);
    navigate('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo, just login as parent
    loginAsRole('parent');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
            <School className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">EduPlatform</h1>
          <p className="text-white/70">Plateforme de gestion éducative nationale</p>
        </div>

        {mode === 'select' ? (
          <div className="bg-white rounded-2xl shadow-2xl p-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-secondary-900 mb-2 text-center">
              Connexion rapide
            </h2>
            <p className="text-secondary-500 text-sm text-center mb-6">
              Sélectionnez votre profil pour accéder à la démo
            </p>

            <div className="space-y-3">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleQuickLogin(role)}
                  className={`
                    w-full flex items-center gap-4 p-4 rounded-xl
                    bg-gradient-to-r ${roleColors[role]} text-white
                    hover:scale-[1.02] active:scale-[0.98]
                    transition-all duration-200 shadow-md hover:shadow-lg
                    group
                  `}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-xl font-bold">{roleLabels[role][0]}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">{roleLabels[role]}</p>
                    <p className="text-sm text-white/80">{roleDescriptions[role]}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity -ml-2" />
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-secondary-500 text-sm mb-3">Ou connectez-vous avec vos identifiants</p>
              <Button variant="outline" className="w-full" onClick={() => setMode('login')}>
                Connexion avec email
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-6 animate-fade-in">
            <button
              onClick={() => setMode('select')}
              className="text-sm text-secondary-500 hover:text-secondary-700 mb-4 flex items-center gap-1"
            >
              <span>←</span> Retour à la sélection
            </button>

            <h2 className="text-xl font-semibold text-secondary-900 mb-2">
              Connexion
            </h2>
            <p className="text-secondary-500 text-sm mb-6">
              Entrez vos identifiants pour accéder à votre espace
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5" />}
                required
              />

              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                iconPosition="left"
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-secondary-600">Se souvenir de moi</span>
                </label>
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                  Mot de passe oublié ?
                </a>
              </div>

              {error && (
                <div className="bg-error-50 text-error-600 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" loading={loading}>
                Se connecter
              </Button>
            </form>
          </div>
        )}

        {/* Footer text */}
        <p className="text-center text-white/50 text-xs mt-6">
          © 2024 EduPlatform - Ministère de l'Éducation Nationale
        </p>
      </div>
    </div>
  );
}
