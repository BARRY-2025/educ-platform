import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { GuineaLogo } from '../../components/brand/GuineaLogo';
import { useAuthStore } from '../../store/auth.store';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-guinea-green via-primary-700 to-guinea-red flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-guinea-yellow/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-guinea-red/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center gap-4">
          <GuineaLogo size="lg" />
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">EduGuinée</h1>
            <p className="text-white/80">Plateforme nationale de gestion éducative</p>
            <p className="text-guinea-yellow text-sm mt-1 font-medium">République de Guinée</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 animate-fade-in">
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">Connexion</h2>
          <p className="text-secondary-500 text-sm mb-6">
            Accédez à votre espace avec vos identifiants officiels
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email ou identifiant"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              required
              autoComplete="username"
            />

            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                iconPosition="left"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-secondary-400 hover:text-secondary-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="bg-error-50 text-error-600 text-sm p-3 rounded-lg border border-error-100">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700" loading={loading}>
              Se connecter
            </Button>
          </form>
        </div>

        <div className="flex justify-center gap-1 mt-6 opacity-60">
          <div className="w-8 h-1.5 rounded-full bg-guinea-red" />
          <div className="w-8 h-1.5 rounded-full bg-guinea-yellow" />
          <div className="w-8 h-1.5 rounded-full bg-guinea-green" />
        </div>

        <p className="text-center text-white/50 text-xs mt-4">
          © {new Date().getFullYear()} EduGuinée — Ministère de l'Éducation Nationale
        </p>
      </div>
    </div>
  );
}
