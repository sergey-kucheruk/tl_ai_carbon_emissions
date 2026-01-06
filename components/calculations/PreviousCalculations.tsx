'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/lib/providers/locale';
import { useTranslations } from '@/lib/i18n';
import { useAuth } from '@/lib/providers/auth';
import type { CalculationInfo } from '@/lib/models/calculation';
import { CalculationsListView } from './CalculationsListView';
import { CalculationsChartView } from './CalculationsChartView';

interface PreviousCalculationsProps {
  onSelectCalculation: (id: number) => void;
  onNewCalculation: () => void;
}

type ViewMode = 'list' | 'chart';
const VIEW_MODE_STORAGE_KEY = 'calculationsViewMode';

export default function PreviousCalculations({
  onSelectCalculation,
  onNewCalculation,
}: PreviousCalculationsProps) {
  const [calculations, setCalculations] = useState<CalculationInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    // Initialize view mode from localStorage
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY) as ViewMode | null;
    if (stored === 'list' || stored === 'chart') {
      setViewMode(stored);
    }
  }, []);

  useEffect(() => {
    const fetchCalculations = async () => {
      try {
        const response = await fetch('/api/calculations', {
          headers: {
            ...getAuthHeaders(),
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCalculations(data.calculations || []);
        }
      } catch (error) {
        console.error('Failed to fetch calculations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalculations();
  }, [getAuthHeaders]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden mb-6">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-gray-800">
              {t('calculations.previousCalculations')}
            </h2>
            <div className="inline-flex rounded-lg border border-green-200 bg-white overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => handleViewModeChange('list')}
                className={`px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 hover:bg-green-50'
                }`}
              >
                {t('calculations.viewModeList')}
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange('chart')}
                className={`px-3 py-1.5 text-xs font-medium border-l border-green-200 transition-all cursor-pointer ${
                  viewMode === 'chart'
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 hover:bg-green-50'
                }`}
              >
                {t('calculations.viewModeChart')}
              </button>
            </div>
          </div>
          <button
            onClick={onNewCalculation}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-lg cursor-pointer"
          >
            {t('calculations.newCalculation')}
          </button>
        </div>
      </div>
      <div className="p-6">
        {calculations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">{t('calculations.noCalculations')}</p>
            <button
              onClick={onNewCalculation}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-lg cursor-pointer"
            >
              {t('calculations.newCalculation')}
            </button>
          </div>
        ) : viewMode === 'list' ? (
          <CalculationsListView
            calculations={calculations}
            onSelectCalculation={onSelectCalculation}
          />
        ) : (
          <CalculationsChartView
            calculations={calculations}
            onSelectCalculation={onSelectCalculation}
          />
        )}
      </div>
    </div>
  );
}
