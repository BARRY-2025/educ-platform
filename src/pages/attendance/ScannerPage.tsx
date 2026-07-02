import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode,
  Camera,
  CheckCircle,
  AlertCircle,
  Clock,
  LogIn,
  LogOut,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { attendanceApi } from '../../lib/api';
import { attendanceStatusLabels } from '../../hooks/useAttendance';

type ScanMode = 'arrival' | 'exit_parent' | 'exit_child';

interface ScanHistoryEntry {
  id: string;
  label: string;
  status: string;
  success: boolean;
  time: string;
}

export function ScannerPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ScanMode>('arrival');
  const [qrInput, setQrInput] = useState('');
  const [parentToken, setParentToken] = useState('');
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<ScanHistoryEntry | null>(null);
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!qrInput.trim()) return;
    setScanning(true);
    setError(null);

    try {
      if (mode === 'arrival') {
        const result = await attendanceApi.scanArrival(qrInput.trim());
        const entry: ScanHistoryEntry = {
          id: Date.now().toString(),
          label: `Élève ${result.student_uuid.slice(0, 8)}...`,
          status: result.status,
          success: true,
          time: result.gate_arrival_time ?? new Date().toISOString(),
        };
        setLastScan(entry);
        setHistory(prev => [entry, ...prev].slice(0, 20));
      } else if (mode === 'exit_parent') {
        const result = await attendanceApi.scanParentExit(qrInput.trim());
        setParentToken(result.session_token);
        const entry: ScanHistoryEntry = {
          id: Date.now().toString(),
          label: `Parent autorisé (${result.student_uuids.length} enfant(s))`,
          status: 'exit_authorized',
          success: true,
          time: new Date().toISOString(),
        };
        setLastScan(entry);
        setHistory(prev => [entry, ...prev].slice(0, 20));
      } else {
        if (!parentToken) {
          setError('Scannez d\'abord le badge parent');
          setScanning(false);
          return;
        }
        const result = await attendanceApi.scanChildExit(qrInput.trim(), parentToken);
        const entry: ScanHistoryEntry = {
          id: Date.now().toString(),
          label: `Sortie élève ${result.student_uuid.slice(0, 8)}...`,
          status: result.status,
          success: true,
          time: result.exit_time ?? new Date().toISOString(),
        };
        setLastScan(entry);
        setHistory(prev => [entry, ...prev].slice(0, 20));
      }
      setQrInput('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur de scan';
      setError(msg);
      setLastScan({
        id: Date.now().toString(),
        label: msg,
        status: 'error',
        success: false,
        time: new Date().toISOString(),
      });
    } finally {
      setScanning(false);
    }
  };

  const modeConfig = {
    arrival: { label: 'Arrivée enfant', icon: LogIn },
    exit_parent: { label: 'Badge parent (sortie)', icon: LogOut },
    exit_child: { label: 'Sortie enfant', icon: LogOut },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Scanner QR / Badge</h1>
          <p className="text-secondary-500 mt-1">Maternelle — Arrivée & sortie sécurisée</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/attendance')}>
          Historique des présences
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(Object.keys(modeConfig) as ScanMode[]).map(m => {
          const cfg = modeConfig[m];
          const Icon = cfg.icon;
          return (
            <button key={m} onClick={() => setMode(m)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === m ? 'bg-primary-600 text-white' : 'bg-gray-100 text-secondary-600 hover:bg-gray-200'
              }`}>
              <Icon className="w-4 h-4" />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {mode === 'exit_child' && parentToken && (
        <div className="p-3 bg-accent-50 text-accent-700 rounded-lg text-sm">
          Session parent active — en attente du scan enfant
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-error-50 text-error-700 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody className="py-8">
            <div className={`w-48 h-48 mx-auto rounded-2xl border-4 flex items-center justify-center mb-6 ${
              scanning ? 'border-primary-500 bg-primary-50' :
              lastScan?.success ? 'border-success-500 bg-success-50' :
              lastScan ? 'border-error-500 bg-error-50' : 'border-gray-200 bg-gray-50'
            }`}>
              {scanning ? (
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              ) : lastScan?.success ? (
                <CheckCircle className="w-16 h-16 text-success-500" />
              ) : lastScan ? (
                <AlertCircle className="w-16 h-16 text-error-500" />
              ) : (
                <QrCode className="w-20 h-20 text-gray-300" />
              )}
            </div>

            <Input
              placeholder={mode === 'exit_parent' ? 'Badge parent (GRD-...)' : 'UUID élève ou MAT-...'}
              value={qrInput}
              onChange={e => setQrInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleScan()}
              className="mb-4"
            />

            <Button className="w-full" size="lg" onClick={handleScan} loading={scanning}
              icon={<Camera className="w-5 h-5" />}>
              Enregistrer le scan
            </Button>
          </CardBody>
        </Card>

        <div className="space-y-4">
          {lastScan && (
            <Card className={lastScan.success ? 'border-success-200' : 'border-error-200'}>
              <CardBody className="py-4">
                <p className="font-medium text-secondary-900">{lastScan.label}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={lastScan.success ? 'success' : 'error'}>
                    {attendanceStatusLabels[lastScan.status] ?? lastScan.status}
                  </Badge>
                  <span className="text-xs text-secondary-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(lastScan.time).toLocaleTimeString('fr-FR')}
                  </span>
                </div>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardBody className="p-0">
              <div className="px-4 py-3 border-b border-gray-100 font-semibold text-sm">Scans récents</div>
              {history.length === 0 ? (
                <p className="py-8 text-center text-secondary-400 text-sm">Aucun scan</p>
              ) : (
                <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                  {history.map(h => (
                    <div key={h.id} className="flex items-center justify-between px-4 py-3 text-sm">
                      <span className="text-secondary-700 truncate">{h.label}</span>
                      <Badge variant={h.success ? 'success' : 'error'} size="sm">
                        {attendanceStatusLabels[h.status] ?? h.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
