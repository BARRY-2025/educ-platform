import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode,
  Camera,
  CheckCircle,
  AlertCircle,
  User,
  Clock,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { students, scanTokens } from '../../mock/data';
import type { Student } from '../../types';

export function ScannerPage() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<{
    success: boolean;
    student?: Student;
    message: string;
    time: string;
  } | null>(null);
  const [scanHistory, setScanHistory] = useState<Array<{
    id: string;
    student: Student;
    time: string;
    status: 'in' | 'out';
  }>>([]);

  const handleScan = () => {
    setScanning(true);

    // Simulate scan
    setTimeout(() => {
      const randomStudent = students[Math.floor(Math.random() * 10)];
      const success = Math.random() > 0.2;

      setLastScan({
        success,
        student: randomStudent,
        message: success
          ? 'Entrée enregistrée avec succès'
          : 'Code QR invalide ou expiré',
        time: new Date().toLocaleTimeString('fr-FR'),
      });

      if (success && randomStudent) {
        setScanHistory(prev => [
          {
            id: Date.now().toString(),
            student: randomStudent,
            time: new Date().toLocaleTimeString('fr-FR'),
            status: 'in',
          },
          ...prev,
        ]);
      }

      setScanning(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Scanner QR / Badge</h1>
          <p className="text-secondary-500 mt-1">Enregistrement des entrées et sorties</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/attendance')}>
          Historique des présences
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner */}
        <Card className="h-fit">
          <CardBody className="text-center py-12">
            <div
              className={`
                w-64 h-64 mx-auto rounded-2xl border-4
                flex items-center justify-center
                transition-all duration-300
                ${scanning
                  ? 'border-primary-500 bg-primary-50'
                  : lastScan?.success
                    ? 'border-success-500 bg-success-50'
                    : lastScan
                      ? 'border-error-500 bg-error-50'
                      : 'border-gray-200 bg-gray-50'
                }
              `}
            >
              {scanning ? (
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="mt-4 text-primary-600 font-medium">Scan en cours...</p>
                </div>
              ) : lastScan ? (
                <div className="text-center">
                  {lastScan.success ? (
                    <CheckCircle className="w-16 h-16 text-success-500 mx-auto" />
                  ) : (
                    <AlertCircle className="w-16 h-16 text-error-500 mx-auto" />
                  )}
                  <p className={`mt-4 font-medium ${lastScan.success ? 'text-success-600' : 'text-error-600'}`}>
                    {lastScan.message}
                  </p>
                </div>
              ) : (
                <QrCode className="w-24 h-24 text-gray-300" />
              )}
            </div>

            <Button
              className="mt-8"
              size="lg"
              onClick={handleScan}
              loading={scanning}
              icon={<Camera className="w-5 h-5" />}
            >
              {scanning ? 'Scan en cours...' : 'Scanner'}
            </Button>
          </CardBody>
        </Card>

        {/* Last scan info */}
        <div className="space-y-6">
          {lastScan?.success && lastScan.student && (
            <Card className="border-2 border-success-200 bg-success-50/50">
              <CardBody className="py-6">
                <div className="flex items-center gap-4">
                  <Avatar name={`${lastScan.student.prenom} ${lastScan.student.nom}`} size="lg" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-secondary-900">
                        {lastScan.student.prenom} {lastScan.student.nom}
                      </h3>
                      <Badge variant="success">Entrée validée</Badge>
                    </div>
                    <p className="text-secondary-500">{lastScan.student.matricule}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-secondary-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {lastScan.time}
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Scan history */}
          <Card>
            <CardBody className="p-0">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-secondary-900">Scans récents</h3>
              </div>
              {scanHistory.length === 0 ? (
                <div className="py-12 text-center text-secondary-500">
                  <QrCode className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Aucun scan récent</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {scanHistory.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                      <Avatar name={`${entry.student.prenom} ${entry.student.nom}`} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-secondary-900 truncate">
                          {entry.student.prenom} {entry.student.nom}
                        </p>
                        <p className="text-xs text-secondary-500">{entry.student.matricule}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={entry.status === 'in' ? 'success' : 'warning'} size="sm">
                          {entry.status === 'in' ? 'Entrée' : 'Sortie'}
                        </Badge>
                        <p className="text-xs text-secondary-400 mt-1">{entry.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card padding="sm" className="text-center p-4">
              <p className="text-3xl font-bold text-primary-600">{scanHistory.filter(s => s.status === 'in').length}</p>
              <p className="text-sm text-secondary-500">Entrées aujourd'hui</p>
            </Card>
            <Card padding="sm" className="text-center p-4">
              <p className="text-3xl font-bold text-warning-600">{scanHistory.filter(s => s.status === 'out').length}</p>
              <p className="text-sm text-secondary-500">Sorties aujourd'hui</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
