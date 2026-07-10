import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { School, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Public Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                <School className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-secondary-900">EduGuinée</span>
                <span className="text-xs text-primary-600">République de Guinée</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/public/rankings" className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors">
                Classements nationaux
              </Link>
              <Link to="/public/statistics" className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors">
                Statistiques
              </Link>
              <Link to="/public/etablissements" className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors">
                Établissements
              </Link>
              <Link to="/login" className="btn-primary">
                Connexion
              </Link>
            </nav>

            <button
              className="md:hidden p-2 rounded-lg text-secondary-500 hover:bg-secondary-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 animate-fade-in">
            <nav className="flex flex-col gap-2">
              <Link to="/public/rankings" className="px-3 py-2 rounded-lg text-secondary-700 hover:bg-gray-50">
                Classements nationaux
              </Link>
              <Link to="/public/statistics" className="px-3 py-2 rounded-lg text-secondary-700 hover:bg-gray-50">
                Statistiques
              </Link>
              <Link to="/public/etablissements" className="px-3 py-2 rounded-lg text-secondary-700 hover:bg-gray-50">
                Établissements
              </Link>
              <hr className="my-2 border-gray-100" />
              <Link to="/login" className="btn-primary text-center">
                Connexion
              </Link>
            </nav>
          </div>
        )}
      </header>

      <Outlet />

      {/* Public Footer */}
      <footer className="bg-secondary-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <School className="w-6 h-6" />
                </div>
                <span className="font-bold text-lg">EduPlatform</span>
              </div>
              <p className="text-secondary-400 text-sm">
                Plateforme nationale de gestion des établissements d'éducation au Sénégal.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2 text-secondary-400 text-sm">
                <li><Link to="/public/rankings" className="hover:text-white transition-colors">Classements</Link></li>
                <li><Link to="/public/statistics" className="hover:text-white transition-colors">Statistiques</Link></li>
                <li><Link to="/public/etablissements" className="hover:text-white transition-colors">Établissements</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-secondary-400 text-sm">
                <li>contact@eduplatform.sn</li>
                <li>+221 33 800 00 00</li>
                <li>Dakar, Sénégal</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-secondary-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CGU</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-secondary-700 mt-8 pt-8 text-center text-secondary-400 text-sm">
            <p>© 2024 EduPlatform - Ministère de l'Éducation Nationale du Sénégal</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
