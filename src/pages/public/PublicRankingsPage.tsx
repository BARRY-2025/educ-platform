import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Award, Star, TrendingUp, Users } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { rankings, etablissements, kpis } from '../../mock/data';

const medalIcons: Record<number, React.ReactNode> = {
  1: <Trophy className="w-8 h-8 text-yellow-500" />,
  2: <Medal className="w-8 h-8 text-gray-400" />,
  3: <Award className="w-8 h-8 text-amber-600" />,
};

export function PublicRankingsPage() {
  const categorizedRankings = {
    lycee: rankings.filter(r => r.categorie === 'lycee'),
    universite: rankings.filter(r => r.categorie === 'universite'),
    institut: rankings.filter(r => r.categorie === 'institut'),
    centre_formation: rankings.filter(r => r.categorie === 'centre_formation'),
  };

  const extendedRankings = [
    { id: '1', etablissementId: 'etb-001', nom: 'Lycée John F. Kennedy', region: 'Dakar', score: 95.2, rang: 1, variation: 0 },
    { id: '2', etablissementId: 'etb-custom-1', nom: 'Lycée Blaise Diagne', region: 'Dakar', score: 94.1, rang: 2, variation: 1 },
    { id: '3', etablissementId: 'etb-custom-2', nom: 'Lycée Saint-Michel', region: 'Dakar', score: 93.5, rang: 3, variation: -1 },
    { id: '4', etablissementId: 'etb-custom-3', nom: 'Lycée Limamoulaye', region: 'Dakar', score: 92.8, rang: 4, variation: 2 },
    { id: '5', etablissementId: 'etb-custom-4', nom: 'Cours Saint-Louis', region: 'Dakar', score: 91.2, rang: 5, variation: 0 },
    { id: '6', etablissementId: 'etb-custom-5', nom: 'Lycée Cheikh Omar Foutiyou Tall', region: 'Dakar', score: 90.5, rang: 6, variation: -2 },
    { id: '7', etablissementId: 'etb-custom-6', nom: 'Lycée Thiaroye', region: 'Dakar', score: 89.3, rang: 7, variation: 1 },
    { id: '8', etablissementId: 'etb-custom-7', nom: 'Lycée Maurice Delafosse', region: 'Dakar', score: 88.7, rang: 8, variation: 0 },
    { id: '9', etablissementId: 'etb-custom-8', nom: 'Lycée Malick Sy', region: 'Thiès', score: 87.5, rang: 9, variation: 3 },
    { id: '10', etablissementId: 'etb-custom-9', nom: 'Lycée Seydou Nourou Tall', region: 'Dakar', score: 86.9, rang: 10, variation: -1 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 mb-4 shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-secondary-900">Classements nationaux</h1>
          <p className="mt-3 text-lg text-secondary-500">
            Les meilleurs établissements du Sénégal - Année scolaire 2024-2025
          </p>
        </div>

        {/* Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {extendedRankings.slice(0, 3).map((rank, idx) => (
            <Card
              key={rank.id}
              className={`relative overflow-hidden ${
                idx === 0 ? 'md:col-start-2 md:row-start-1 md:-mt-4' : ''
              }`}
              hover
            >
              <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full transform translate-x-8 -translate-y-8 ${
                idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-amber-600'
              }`} />
              <CardBody className="text-center py-8">
                <div className="flex justify-center mb-4">
                  {medalIcons[rank.rang] || <Star className="w-8 h-8 text-secondary-400" />}
                </div>
                <Badge variant={idx === 0 ? 'warning' : idx === 1 ? 'secondary' : 'accent'} size="md" className="mb-3">
                  #{rank.rang}
                </Badge>
                <h3 className="text-xl font-bold text-secondary-900">{rank.nom}</h3>
                <p className="text-secondary-500 mt-1">{rank.region}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-3xl font-bold text-primary-600">{rank.score}</p>
                  <p className="text-sm text-secondary-400">Score global</p>
                </div>
                {rank.variation !== 0 && (
                  <div className={`mt-3 flex items-center justify-center gap-1 text-sm ${rank.variation > 0 ? 'text-success-600' : 'text-error-600'}`}>
                    <TrendingUp className={`w-4 h-4 ${rank.variation < 0 ? 'rotate-180' : ''}`} />
                    <span>{Math.abs(rank.variation)} place{Math.abs(rank.variation) > 1 ? 's' : ''}</span>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Full rankings table */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-secondary-900">Classement des lycées</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {extendedRankings.map((rank, idx) => (
              <div
                key={rank.id}
                className="flex items-center gap-6 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-secondary-900">
                  {rank.rang}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-secondary-900">{rank.nom}</h3>
                  <p className="text-sm text-secondary-500">{rank.region}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">{rank.score}</p>
                  <p className="text-xs text-secondary-400">Score</p>
                </div>
                <div className="w-16 text-center">
                  {rank.variation > 0 ? (
                    <span className="inline-flex items-center text-success-600 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +{rank.variation}
                    </span>
                  ) : rank.variation < 0 ? (
                    <span className="inline-flex items-center text-error-600 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                      {rank.variation}
                    </span>
                  ) : (
                    <span className="text-secondary-400 text-sm">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Categories */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Universités</h3>
              <div className="space-y-3">
                {[
                  { nom: 'UCAD', score: 92.1, rang: 1 },
                  { nom: 'UGB', score: 89.5, rang: 2 },
                  { nom: 'USSEIN', score: 85.2, rang: 3 },
                ].map((u) => (
                  <div key={u.rang} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                        {u.rang}
                      </span>
                      <span className="font-medium">{u.nom}</span>
                    </div>
                    <span className="font-semibold text-secondary-900">{u.score}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Instituts</h3>
              <div className="space-y-3">
                {[
                  { nom: 'IST Thiès', score: 88.5, rang: 1 },
                  { nom: 'ISI Dakar', score: 86.2, rang: 2 },
                  { nom: 'EPT Dakar', score: 84.1, rang: 3 },
                ].map((u) => (
                  <div key={u.rang} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-accent-100 text-accent-600 flex items-center justify-center font-bold text-sm">
                        {u.rang}
                      </span>
                      <span className="font-medium">{u.nom}</span>
                    </div>
                    <span className="font-semibold text-secondary-900">{u.score}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
