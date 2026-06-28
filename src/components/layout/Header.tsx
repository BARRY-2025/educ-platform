import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, X, User, Settings, LogOut, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useUIStore } from '../../store/ui.store';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { notifications } from '../../mock/data';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifications = notifications.filter(n => !n.lu).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/students?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-white border-b border-gray-100 z-30" style={{ marginLeft: sidebarCollapsed ? '5rem' : '16rem' }}>
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Rechercher un apprenant, une classe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm
                focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                hover:border-gray-300 transition-all"
            />
          </form>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-secondary-900">Notifications</h3>
                  <p className="text-xs text-secondary-500">{unreadNotifications} non lues</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.slice(0, 5).map((notif) => (
                    <button
                      key={notif.id}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${!notif.lu ? 'bg-primary-50/50' : ''}`}
                      onClick={() => navigate('/notifications')}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${!notif.lu ? 'bg-primary-500' : 'bg-secondary-300'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-secondary-900 truncate">{notif.titre}</p>
                          <p className="text-xs text-secondary-500 mt-0.5 truncate">{notif.message}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button
                    onClick={() => navigate('/notifications')}
                    className="text-sm text-primary-600 font-medium hover:text-primary-700"
                  >
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <button className="p-2 rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 transition-colors hidden md:block">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Separator */}
          <div className="w-px h-8 bg-gray-200 mx-2 hidden md:block" />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <Avatar name={user ? `${user.prenom} ${user.nom}` : undefined} size="sm" />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-secondary-900">{user?.prenom}</p>
                <p className="text-xs text-secondary-500 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium text-secondary-900">{user?.prenom} {user?.nom}</p>
                  <p className="text-sm text-secondary-500">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                  >
                    <User className="w-4 h-4" />
                    Mon profil
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      navigate('/settings');
                      setShowUserMenu(false);
                    }}
                  >
                    <Settings className="w-4 h-4" />
                    Paramètres
                  </button>
                </div>
                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
