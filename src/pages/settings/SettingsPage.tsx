import { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { useUIStore } from '../../store/ui.store';
import { Button, Card, Input, Select } from '../../components/ui';
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Palette,
  Lock,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor,
  Save,
  RefreshCw,
  Download,
  Trash2,
  Key,
  Smartphone,
  Mail,
  MessageSquare,
  Check,
  AlertCircle,
} from 'lucide-react';

type SettingsTab = 'general' | 'notifications' | 'security' | 'privacy' | 'account';

interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  absenceAlert: boolean;
  gradeAlert: boolean;
  paymentAlert: boolean;
  newsAlert: boolean;
  reminderAlert: boolean;
}

interface PrivacySettings {
  profileVisible: boolean;
  showEmail: boolean;
  showPhone: boolean;
  allowMessages: boolean;
  showInRankings: boolean;
}

export function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useUIStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // General settings
  const [language, setLanguage] = useState('fr');
  const [timezone, setTimezone] = useState('Africa/Dakar');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    absenceAlert: true,
    gradeAlert: true,
    paymentAlert: true,
    newsAlert: false,
    reminderAlert: true,
  });

  // Security settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Privacy settings
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showInRankings: true,
  });

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <Settings className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Eye className="w-4 h-4" /> },
    { id: 'account', label: 'Account', icon: <Key className="w-4 h-4" /> },
  ];

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    alert('Mot de passe modifie avec succes');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary-600" />
          Langue et Region
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Langue de l'interface
            </label>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              options={[
                { value: 'fr', label: 'Francais' },
                { value: 'en', label: 'English' },
                { value: 'wo', label: 'Wolof' },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Fuseau horaire
            </label>
            <Select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              options={[
                { value: 'Africa/Dakar', label: 'Dakar (GMT+0)' },
                { value: 'Africa/Abidjan', label: 'Abidjan (GMT+0)' },
                { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Format de date
            </label>
            <Select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              options={[
                { value: 'DD/MM/YYYY', label: 'JJ/MM/AAAA' },
                { value: 'MM/DD/YYYY', label: 'MM/JJ/AAAA' },
                { value: 'YYYY-MM-DD', label: 'AAAA-MM-JJ' },
              ]}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary-600" />
          Apparence
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-3">
              Theme
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  theme === 'light'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span className="font-medium">Clair</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span className="font-medium">Sombre</span>
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-secondary-200 text-secondary-400 cursor-not-allowed"
                disabled
              >
                <Monitor className="w-5 h-5" />
                <span className="font-medium">Systeme</span>
              </button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-primary-600" />
          Interface
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Menu compact</p>
              <p className="text-sm text-secondary-500">Reduire la taille du menu lateral</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Animations</p>
              <p className="text-sm text-secondary-500">Activer les animations de l'interface</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary-600" />
          Canaux de notification
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-secondary-600" />
              <div>
                <p className="font-medium text-secondary-900">Email</p>
                <p className="text-sm text-secondary-500">Recevoir des notifications par email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailEnabled}
                onChange={(e) => setNotifications({ ...notifications, emailEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-secondary-600" />
              <div>
                <p className="font-medium text-secondary-900">SMS</p>
                <p className="text-sm text-secondary-500">Recevoir des notifications par SMS</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.smsEnabled}
                onChange={(e) => setNotifications({ ...notifications, smsEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-secondary-600" />
              <div>
                <p className="font-medium text-secondary-900">Push</p>
                <p className="text-sm text-secondary-500">Notifications push sur mobile/desktop</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.pushEnabled}
                onChange={(e) => setNotifications({ ...notifications, pushEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Types de notifications
        </h3>
        <div className="space-y-4">
          {[
            { key: 'absenceAlert', label: 'Alertes d\'absence', desc: 'Etre notifie quand un eleve est absent' },
            { key: 'gradeAlert', label: 'Nouvelles notes', desc: 'Etre notifie lors de la publication des notes' },
            { key: 'paymentAlert', label: 'Paiements', desc: 'Rappels et confirmations de paiement' },
            { key: 'newsAlert', label: 'Actualites', desc: 'Nouvelles et annonces de l\'etablissement' },
            { key: 'reminderAlert', label: 'Rappels', desc: 'Rappels pour les evenements et echeances' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-secondary-100 last:border-0">
              <div>
                <p className="font-medium text-secondary-900">{item.label}</p>
                <p className="text-sm text-secondary-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key as keyof NotificationSettings] as boolean}
                  onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary-600" />
          Changer le mot de passe
        </h3>
        <div className="space-y-4 max-w-md">
          <div className="relative">
            <Input
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="Mot de passe actuel"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
            >
              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="relative">
            <Input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Input
            type="password"
            placeholder="Confirmer le nouveau mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button onClick={handleChangePassword} disabled={saving}>
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Mettre a jour le mot de passe
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-600" />
          Authentification a deux facteurs
        </h3>
        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
          <div>
            <p className="font-medium text-secondary-900">2FA active</p>
            <p className="text-sm text-secondary-500">
              {twoFactorEnabled
                ? 'Votre compte est protege par 2FA'
                : 'Ajouter une couche de securite supplementaire'}
            </p>
          </div>
          <Button
            variant={twoFactorEnabled ? 'outline' : 'primary'}
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
          >
            {twoFactorEnabled ? 'Desactiver' : 'Activer'}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Sessions actives
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-primary-600" />
              <div>
                <p className="font-medium text-secondary-900">Cet appareil</p>
                <p className="text-sm text-secondary-500">Dakar, Senegal - Actif maintenant</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
              Actif
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-secondary-600" />
              <div>
                <p className="font-medium text-secondary-900">iPhone 15</p>
                <p className="text-sm text-secondary-500">Dakar, Senegal - Il y a 2 heures</p>
              </div>
            </div>
            <button className="text-sm text-error-600 hover:text-error-700 font-medium">
              Deconnecter
            </button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary-600" />
          Visibilite du profil
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-secondary-100">
            <div>
              <p className="font-medium text-secondary-900">Profil public</p>
              <p className="text-sm text-secondary-500">Permettre aux autres de voir votre profil</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.profileVisible}
                onChange={(e) => setPrivacy({ ...privacy, profileVisible: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-secondary-100">
            <div>
              <p className="font-medium text-secondary-900">Afficher l'email</p>
              <p className="text-sm text-secondary-500">Afficher votre adresse email sur votre profil</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.showEmail}
                onChange={(e) => setPrivacy({ ...privacy, showEmail: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-secondary-100">
            <div>
              <p className="font-medium text-secondary-900">Afficher le telephone</p>
              <p className="text-sm text-secondary-500">Afficher votre numero de telephone</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.showPhone}
                onChange={(e) => setPrivacy({ ...privacy, showPhone: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-secondary-100">
            <div>
              <p className="font-medium text-secondary-900">Autoriser les messages</p>
              <p className="text-sm text-secondary-500">Permettre aux autres utilisateurs de vous envoyer des messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.allowMessages}
                onChange={(e) => setPrivacy({ ...privacy, allowMessages: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-secondary-900">Apparaitre dans les classements</p>
              <p className="text-sm text-secondary-500">Afficher votre profil dans les classements publics</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.showInRankings}
                onChange={(e) => setPrivacy({ ...privacy, showInRankings: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-primary-600" />
          Donnees personnelles
        </h3>
        <p className="text-secondary-600 mb-4">
          Telechargez une copie de toutes vos donnees personnelles stockees sur la plateforme.
        </p>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Telecharger mes donnees
        </Button>
      </Card>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Informations du compte
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
              <p className="text-secondary-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Role</label>
              <p className="text-secondary-900 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Nom complet</label>
              <p className="text-secondary-900">{user?.prenom} {user?.nom}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Telephone</label>
              <p className="text-secondary-900">{user?.telephone || 'Non renseigne'}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Preferences du compte
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-secondary-100">
            <div>
              <p className="font-medium text-secondary-900">Mode demonstration</p>
              <p className="text-sm text-secondary-500">Utiliser des donnees fictives pour tester</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-secondary-100">
            <div>
              <p className="font-medium text-secondary-900">Communication marketing</p>
              <p className="text-sm text-secondary-500">Recevoir des offres et nouveautes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-error-200 bg-error-50">
        <h3 className="text-lg font-semibold text-error-700 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Zone de danger
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Desactiver le compte</p>
              <p className="text-sm text-secondary-500">Votre compte sera inactif temporairement</p>
            </div>
            <Button variant="outline" className="border-error-300 text-error-600 hover:bg-error-100">
              Desactiver
            </Button>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-error-200">
            <div>
              <p className="font-medium text-error-700">Supprimer le compte</p>
              <p className="text-sm text-secondary-500">Cette action est irreversible</p>
            </div>
            <Button variant="primary" className="bg-error-600 hover:bg-error-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'account':
        return renderAccountSettings();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-secondary-900">Parametres</h1>
        <p className="text-secondary-600 mt-1">Gerez vos preferences et parametres de compte</p>
      </div>

      <div className="flex gap-6">
        {/* Tabs Sidebar */}
        <div className="w-64 shrink-0">
          <Card className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-secondary-600 hover:bg-secondary-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {renderContent()}

          {/* Save Button */}
          <div className="mt-6 flex items-center gap-4">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : saved ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Enregistrement...' : saved ? 'Enregistre !' : 'Enregistrer les modifications'}
            </Button>
            {saved && (
              <span className="text-sm text-success-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Les modifications ont ete enregistrees
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
