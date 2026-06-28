import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Shield,
  Camera,
  Edit,
  Save,
  X,
  GraduationCap,
  Calendar,
  BookOpen,
  CreditCard,
  Users,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useAuthStore } from '../../store/auth.store';
import { etablissements, classes, subjects } from '../../mock/data';

type TabId = 'profile' | 'security' | 'notifications' | 'preferences';

export function ProfilePage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    ville: 'Dakar',
    adresse: '123 Rue Example',
  });

  const tabs = [
    { id: 'profile' as const, label: 'Profil', icon: User },
    { id: 'security' as const, label: 'Sécurité', icon: Lock },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'preferences' as const, label: 'Préférences', icon: Shield },
  ];

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Administrateur',
    admin_etablissement: 'Administrateur Établissement',
    enseignant: 'Enseignant',
    parent: 'Parent / Tuteur',
    apprenant: 'Apprenant',
  };

  const roleDescriptions: Record<string, string> = {
    super_admin: 'Accès complet à toutes les fonctionnalités nationales',
    admin_etablissement: 'Gestion complète de l\'établissement Lycée John F. Kennedy',
    enseignant: 'Professeur de Mathématiques - Terminale S1, Première S',
    parent: 'Responsable légal de 2 apprenants',
    apprenant: 'Élève en Terminale S1 - Matricule: MAT-2024-00005',
  };

  const getRoleStats = () => {
    switch (user?.role) {
      case 'apprenant':
        return [
          { label: 'Moyenne générale', value: '13.5/20', icon: BookOpen, color: 'success' },
          { label: 'Taux de présence', value: '95%', icon: Calendar, color: 'primary' },
          { label: 'Rang de classe', value: '3/32', icon: GraduationCap, color: 'accent' },
          { label: 'Solde à payer', value: '125 000 FCFA', icon: CreditCard, color: 'warning' },
        ];
      case 'parent':
        return [
          { label: 'Enfants inscrits', value: '2', icon: Users, color: 'primary' },
          { label: 'Paiements en cours', value: '3', icon: CreditCard, color: 'warning' },
          { label: 'Notifications non lues', value: '5', icon: Bell, color: 'error' },
          { label: 'Année scolaire', value: '2024-2025', icon: Calendar, color: 'accent' },
        ];
      case 'enseignant':
        return [
          { label: 'Classes assignées', value: '4', icon: GraduationCap, color: 'primary' },
          { label: 'Apprenants', value: '128', icon: Users, color: 'accent' },
          { label: 'Heures/semaine', value: '24h', icon: Calendar, color: 'warning' },
          { label: 'Matières', value: '3', icon: BookOpen, color: 'success' },
        ];
      case 'admin_etablissement':
        return [
          { label: 'Apprenants', value: '1 250', icon: Users, color: 'primary' },
          { label: 'Enseignants', value: '85', icon: GraduationCap, color: 'accent' },
          { label: 'Classes', value: '42', icon: BookOpen, color: 'warning' },
          { label: 'Taux présence', value: '94.5%', icon: Calendar, color: 'success' },
        ];
      default:
        return [
          { label: 'Établissements', value: '4 521', icon: GraduationCap, color: 'primary' },
          { label: 'Apprenants', value: '2.85M', icon: Users, color: 'accent' },
          { label: 'Enseignants', value: '85 000', icon: User, color: 'warning' },
          { label: 'Régions', value: '14', icon: MapPin, color: 'success' },
        ];
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Mon profil</h1>
          <p className="text-secondary-500 mt-1">Gérez vos informations personnelles</p>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <Button icon={<Edit className="w-4 h-4" />} onClick={() => setIsEditing(true)}>
              Modifier le profil
            </Button>
          ) : (
            <>
              <Button variant="secondary" icon={<X className="w-4 h-4" />} onClick={() => setIsEditing(false)}>
                Annuler
              </Button>
              <Button icon={<Save className="w-4 h-4" />} onClick={handleSave}>
                Enregistrer
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardBody className="py-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar
                name={`${user?.prenom} ${user?.nom}`}
                size="xl"
                className="w-24 h-24 text-2xl"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-secondary-900">
                {user?.prenom} {user?.nom}
              </h2>
              <p className="text-secondary-500 mt-1">{user?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                <Badge variant="primary" size="md">{roleLabels[user?.role || 'apprenant']}</Badge>
                <Badge variant="success" size="md" dot>Actif</Badge>
              </div>
              <p className="text-sm text-secondary-400 mt-2">
                {roleDescriptions[user?.role || 'apprenant']}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              {getRoleStats().map((stat, idx) => (
                <div key={idx} className="text-center px-4 py-3 bg-gray-50 rounded-lg">
                  <stat.icon className={`w-5 h-5 mx-auto text-${stat.color}-500`} />
                  <p className="text-lg font-bold text-secondary-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-secondary-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg
                transition-colors
                ${activeTab === tab.id
                  ? 'bg-white text-primary-700 border-t border-x border-gray-200 -mb-px'
                  : 'text-secondary-500 hover:text-secondary-700 hover:bg-gray-50'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'profile' && (
            <>
              <Card>
                <CardHeader>Informations personnelles</CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      disabled={!isEditing}
                      icon={<User className="w-5 h-5" />}
                    />
                    <Input
                      label="Prénom"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      disabled={!isEditing}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      icon={<Mail className="w-5 h-5" />}
                    />
                    <Input
                      label="Téléphone"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      disabled={!isEditing}
                      icon={<Phone className="w-5 h-5" />}
                    />
                    <Input
                      label="Ville"
                      value={formData.ville}
                      onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                      disabled={!isEditing}
                      icon={<MapPin className="w-5 h-5" />}
                    />
                    <Input
                      label="Adresse"
                      value={formData.adresse}
                      onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </CardBody>
              </Card>

              {/* Role-specific information */}
              {user?.role === 'apprenant' && (
                <Card>
                  <CardHeader>Informations académiques</CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-secondary-500">Matricule</p>
                        <p className="font-semibold text-secondary-900">MAT-2024-00005</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-secondary-500">Classe</p>
                        <p className="font-semibold text-secondary-900">Terminale S1</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-secondary-500">Établissement</p>
                        <p className="font-semibold text-secondary-900">Lycée John F. Kennedy</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-secondary-500">Date d'inscription</p>
                        <p className="font-semibold text-secondary-900">01/09/2024</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}

              {user?.role === 'parent' && (
                <Card>
                  <CardHeader>Enfants associés</CardHeader>
                  <CardBody className="p-0">
                    <div className="divide-y divide-gray-100">
                      {[
                        { nom: 'Amadou Fall', classe: 'Terminale S1', moyenne: '13.5/20' },
                        { nom: 'Aminata Fall', classe: 'Première S', moyenne: '14.2/20' },
                      ].map((child, idx) => (
                        <div key={idx} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                          <Avatar name={child.nom} size="md" />
                          <div className="flex-1">
                            <p className="font-medium text-secondary-900">{child.nom}</p>
                            <p className="text-sm text-secondary-500">{child.classe}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary-600">{child.moyenne}</p>
                            <p className="text-xs text-secondary-400">Moyenne</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}

              {user?.role === 'enseignant' && (
                <Card>
                  <CardHeader>Classes et matières</CardHeader>
                  <CardBody className="p-0">
                    <div className="divide-y divide-gray-100">
                      {subjects.slice(0, 3).map((subject) => (
                        <div key={subject.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                              {subject.code}
                            </div>
                            <div>
                              <p className="font-medium text-secondary-900">{subject.nom}</p>
                              <p className="text-sm text-secondary-500">Coef. {subject.coefficient}</p>
                            </div>
                          </div>
                          <Badge variant="secondary">Terminale S1</Badge>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}
            </>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>Changer le mot de passe</CardHeader>
              <CardBody>
                <div className="space-y-4 max-w-md">
                  <Input
                    label="Mot de passe actuel"
                    type="password"
                    placeholder="Entrez votre mot de passe actuel"
                    icon={<Lock className="w-5 h-5" />}
                  />
                  <Input
                    label="Nouveau mot de passe"
                    type="password"
                    placeholder="Entrez le nouveau mot de passe"
                    icon={<Lock className="w-5 h-5" />}
                  />
                  <Input
                    label="Confirmer le mot de passe"
                    type="password"
                    placeholder="Confirmez le nouveau mot de passe"
                    icon={<Lock className="w-5 h-5" />}
                  />
                  <Button className="mt-4">Mettre à jour le mot de passe</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>Préférences de notification</CardHeader>
              <CardBody>
                <div className="space-y-6">
                  {[
                    { title: 'Notifications par email', description: 'Recevoir les notifications par email', enabled: true },
                    { title: 'Notifications SMS', description: 'Recevoir les notifications par SMS', enabled: true },
                    { title: 'Notifications push', description: 'Notifications sur l\'application', enabled: false },
                    { title: 'Rappels de paiement', description: 'Rappels avant les échéances', enabled: true },
                    { title: 'Alertes d\'absence', description: 'Notification si votre enfant est absent', enabled: true },
                    { title: 'Nouvelles notes', description: 'Notification lors de la publication des notes', enabled: true },
                  ].map((notif, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-secondary-900">{notif.title}</p>
                        <p className="text-sm text-secondary-500">{notif.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={notif.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card>
              <CardHeader>Préférences de l'application</CardHeader>
              <CardBody>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Langue</label>
                    <Select
                      options={[
                        { value: 'fr', label: 'Français' },
                        { value: 'wo', label: 'Wolof' },
                        { value: 'en', label: 'English' },
                      ]}
                      defaultValue="fr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Fuseau horaire</label>
                    <Select
                      options={[
                        { value: 'africa/dakar', label: 'Africa/Dakar (GMT+0)' },
                        { value: 'europe/paris', label: 'Europe/Paris (GMT+1)' },
                      ]}
                      defaultValue="africa/dakar"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900">Mode sombre</p>
                      <p className="text-sm text-secondary-500">Activer le thème sombre</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>Activité récente</CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-gray-100">
                {[
                  { action: 'Connexion', time: 'Aujourd\'hui 10:30', icon: Shield },
                  { action: 'Profil mis à jour', time: 'Hier 15:45', icon: Edit },
                  { action: 'Mot de passe changé', time: '12/01/2024', icon: Lock },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-3">
                    <activity.icon className="w-4 h-4 text-secondary-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900">{activity.action}</p>
                      <p className="text-xs text-secondary-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>Complétion du profil</CardHeader>
            <CardBody>
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-primary-600">85%</p>
                <p className="text-sm text-secondary-500">Profil complété</p>
              </div>
              <ProgressBar value={85} color="primary" size="md" />
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2 text-success-600">
                  <span className="w-4 h-4 rounded-full bg-success-100 flex items-center justify-center">✓</span>
                  Informations personnelles
                </li>
                <li className="flex items-center gap-2 text-success-600">
                  <span className="w-4 h-4 rounded-full bg-success-100 flex items-center justify-center">✓</span>
                  Email vérifié
                </li>
                <li className="flex items-center gap-2 text-warning-600">
                  <span className="w-4 h-4 rounded-full bg-warning-100 flex items-center justify-center">○</span>
                  Photo de profil
                </li>
                <li className="flex items-center gap-2 text-warning-600">
                  <span className="w-4 h-4 rounded-full bg-warning-100 flex items-center justify-center">○</span>
                  2FA activé
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
