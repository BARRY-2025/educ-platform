import React, { useState } from 'react';
import {
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
  Filter,
  Mail,
  Smartphone,
  Send,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal, ModalBody, ModalFooter } from '../../components/ui/Modal';
import { notifications as mockNotifications } from '../../mock/data';
import type { Notification } from '../../types';

const typeLabels: Record<string, string> = {
  absence: 'Absence',
  note: 'Note',
  paiement: 'Paiement',
  info: 'Information',
  alerte: 'Alerte',
};

const typeVariants: Record<string, 'error' | 'success' | 'warning' | 'primary' | 'secondary'> = {
  absence: 'error',
  note: 'success',
  paiement: 'warning',
  info: 'primary',
  alerte: 'secondary',
};

const channelIcons: Record<string, React.ReactNode> = {
  email: <Mail className="w-4 h-4" />,
  sms: <Smartphone className="w-4 h-4" />,
  push: <Bell className="w-4 h-4" />,
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showSendModal, setShowSendModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredNotifications = notifications.filter(n => {
    const matchesType = typeFilter === '' || n.type === typeFilter;
    const matchesStatus = statusFilter === '' ||
      (statusFilter === 'lu' && n.lu) ||
      (statusFilter === 'non_lu' && !n.lu);
    return matchesType && matchesStatus;
  });

  const unreadCount = notifications.filter(n => !n.lu).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, lu: true } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Notifications</h1>
          <p className="text-secondary-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} notifications non lues` : 'Toutes les notifications lues'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button variant="outline" icon={<CheckCheck className="w-4 h-4" />} onClick={markAllAsRead}>
              Tout marquer comme lu
            </Button>
          )}
          <Button icon={<Send className="w-4 h-4" />} onClick={() => setShowSendModal(true)}>
            Envoyer notification
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Select
          options={[
            { value: '', label: 'Tous les types' },
            { value: 'absence', label: 'Absence' },
            { value: 'note', label: 'Note' },
            { value: 'paiement', label: 'Paiement' },
            { value: 'info', label: 'Information' },
            { value: 'alerte', label: 'Alerte' },
          ]}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-48"
        />
        <Select
          options={[
            { value: '', label: 'Tous les statuts' },
            { value: 'non_lu', label: 'Non lu' },
            { value: 'lu', label: 'Lu' },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48"
        />
      </div>

      <Card>
        <CardBody className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center">
              <BellOff className="w-16 h-16 mx-auto text-secondary-300" />
              <p className="mt-4 text-secondary-500">Aucune notification</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    flex items-start gap-4 px-6 py-4 transition-colors
                    hover:bg-gray-50 cursor-pointer
                    ${!notification.lu ? 'bg-primary-50/50' : ''}
                  `}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={`w-2 h-2 rounded-full mt-2.5 flex-shrink-0 ${!notification.lu ? 'bg-primary-500' : 'bg-transparent'}`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={typeVariants[notification.type]} size="sm">
                        {typeLabels[notification.type]}
                      </Badge>
                      <span className="text-xs text-secondary-400">
                        {channelIcons[notification.channel]}
                      </span>
                    </div>
                    <p className={`mt-1 ${!notification.lu ? 'font-semibold text-secondary-900' : 'font-medium text-secondary-700'}`}>
                      {notification.titre}
                    </p>
                    <p className="mt-0.5 text-sm text-secondary-500">{notification.message}</p>
                    <p className="mt-2 text-xs text-secondary-400">
                      {new Date(notification.dateEnvoi).toLocaleString('fr-FR')}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="p-2 rounded-lg text-secondary-400 hover:text-error-600 hover:bg-error-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        title="Envoyer une notification"
      >
        <ModalBody>
          <div className="space-y-4">
            <Select
              label="Type de notification"
              required
              options={[
                { value: 'info', label: 'Information' },
                { value: 'alerte', label: 'Alerte' },
                { value: 'absence', label: 'Absence' },
                { value: 'note', label: 'Note' },
                { value: 'paiement', label: 'Paiement' },
              ]}
            />
            <Input label="Titre" placeholder="Titre de la notification" required />
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Message</label>
              <textarea
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-secondary-800 placeholder:text-secondary-400 transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 hover:border-gray-300 resize-none"
                rows={4}
                placeholder="Contenu du message..."
              />
            </div>
            <Select
              label="Canal d'envoi"
              required
              options={[
                { value: 'email', label: 'Email' },
                { value: 'sms', label: 'SMS' },
                { value: 'push', label: 'Push notification' },
              ]}
            />
            <Select
              label="Destinataires"
              required
              options={[
                { value: 'all', label: 'Tous les parents' },
                { value: 'class', label: 'Une classe spécifique' },
                { value: 'student', label: 'Un apprenant spécifique' },
              ]}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowSendModal(false)}>
            Annuler
          </Button>
          <Button icon={<Send className="w-4 h-4" />}>
            Envoyer
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
