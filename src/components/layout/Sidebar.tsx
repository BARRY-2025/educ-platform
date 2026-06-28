import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  FileText,
  CreditCard,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronLeft,
  School,
  Trophy,
  LucideIcon,
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useUIStore } from '../../store/ui.store';
import { Avatar } from '../ui/Avatar';
import type { UserRole } from '../../types';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  roles: UserRole[];
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard, roles: ['super_admin', 'admin_etablissement', 'enseignant'] },
  { label: 'Apprenants', path: '/students', icon: Users, roles: ['super_admin', 'admin_etablissement', 'enseignant'] },
  { label: 'Mes notes', path: '/my-grades', icon: FileText, roles: ['apprenant'] },
  { label: 'Gestion des notes', path: '/grades', icon: FileText, roles: ['super_admin', 'admin_etablissement', 'enseignant'] },
  { label: 'Présences', path: '/attendance', icon: CalendarCheck, roles: ['super_admin', 'admin_etablissement', 'enseignant', 'parent'] },
  { label: 'Scan QR', path: '/scan', icon: GraduationCap, roles: ['enseignant'] },
  { label: 'Finance', path: '/finance', icon: CreditCard, roles: ['super_admin', 'admin_etablissement', 'parent'] },
  { label: 'Mes paiements', path: '/my-payments', icon: CreditCard, roles: ['apprenant', 'parent'] },
  { label: 'Notifications', path: '/notifications', icon: Bell, roles: ['super_admin', 'admin_etablissement', 'enseignant', 'parent', 'apprenant'] },
  { label: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['super_admin', 'admin_etablissement'] },
  { label: 'Classements', path: '/rankings', icon: Trophy, roles: ['super_admin', 'admin_etablissement'] },
  { label: 'Paramètres', path: '/settings', icon: Settings, roles: ['super_admin', 'admin_etablissement', 'enseignant', 'parent', 'apprenant'] },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebarCollapse } = useUIStore();

  const filteredNavItems = navItems.filter(item =>
    user?.role && item.roles.includes(user.role)
  );

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200
        transition-all duration-300 z-40 flex flex-col
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
            <School className="w-6 h-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-secondary-900 leading-tight">EduPlatform</span>
              <span className="text-xs text-secondary-400">Sénégal</span>
            </div>
          )}
        </Link>
        <button
          onClick={toggleSidebarCollapse}
          className="p-1.5 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200 group relative
                    ${isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-secondary-400 group-hover:text-secondary-600'}`} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-error-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-3 px-2 py-1 bg-secondary-900 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-gray-100">
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <Avatar name={user ? `${user.prenom} ${user.nom}` : undefined} size="sm" />
          {!sidebarCollapsed && user && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate">
                {user.prenom} {user.nom}
              </p>
              <p className="text-xs text-secondary-500 truncate">{user.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className={`
            mt-3 flex items-center gap-2 w-full px-3 py-2 rounded-lg
            text-error-600 hover:bg-error-50 transition-colors
            ${sidebarCollapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut className="w-4 h-4" />
          {!sidebarCollapsed && <span className="text-sm font-medium">Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
