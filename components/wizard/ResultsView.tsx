'use client';

import { useLocale } from '@/lib/providers/locale';
import { useTranslations } from '@/lib/i18n';
import type { CarbonFootprintOutput } from '@/lib/models/calculation';
import { generatePDF } from '@/lib/utils/pdf';

interface ResultsViewProps {
  results: CarbonFootprintOutput;
  onReset: () => void;
  onBack: () => void;
  onSave?: () => void;
  isReadOnly?: boolean;
}

export default function ResultsView({ results, onReset, onBack, onSave, isReadOnly }: ResultsViewProps) {
  const { locale } = useLocale();
  const t = useTranslations(locale);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(locale === 'en' ? 'en-US' : locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const handleDownloadPDF = () => {
    generatePDF(results, {
      locale,
      translations: {
        resultsTitle: t('results.title'),
        totalFootprint: t('results.totalFootprint'),
        scope1: t('calculator.scope1'),
        scope2: t('calculator.scope2'),
        scope3: t('calculator.scope3'),
        breakdown: t('results.breakdown'),
        energyCarriers: t('calculator.energyCarriers'),
        fleet: t('calculator.fleet'),
        refrigerants: t('calculator.refrigerants'),
        electricity: t('calculator.electricity'),
        districtHeating: t('calculator.districtHeating'),
        waterSewage: t('calculator.waterSewage'),
        paperWaste: t('calculator.paperWaste'),
        airTravel: t('calculator.airTravel'),
        trainTravel: t('calculator.trainTravel'),
        kgCO2e: 'kg CO2e',
        generatedOn: t('results.generatedOn'),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-between">
        {!isReadOnly && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all cursor-pointer"
          >
            ← {t('calculator.back')}
          </button>
        )}
        <div className={`flex gap-2 ${isReadOnly ? 'ml-auto' : ''}`}>
          {!isReadOnly && (
            <button
              onClick={onReset}
              className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all shadow-lg cursor-pointer"
            >
              {t('calculator.discard')}
            </button>
          )}
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {t('results.downloadPDF')}
          </button>
          {onSave && !isReadOnly && (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-purple-500 text-white text-sm font-semibold rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all shadow-lg cursor-pointer"
            >
              {t('modals.saveCalculation')}
            </button>
          )}
        </div>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-4">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {t('results.title')}
        </h2>
        <p className="text-gray-600">{t('results.description')}</p>
      </div>

      {/* Total Footprint */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-8 text-white text-center shadow-lg">
        <p className="text-lg font-medium mb-2">{t('results.totalFootprint')}</p>
        <p className="text-5xl font-bold">{formatNumber(results.totalFootprint)}</p>
        <p className="text-green-100 mt-2">kg CO₂e</p>
      </div>

      {/* Scope Breakdowns */}
      <div className="space-y-4">
        {/* Scope 1 */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-red-800 flex items-center">
              <span className="mr-2">🔥</span>
              {t('calculator.scope1')}
            </h3>
            <div className="text-right">
              <p className="text-3xl font-bold text-red-600">
                {formatNumber(results.scope1Total)}
              </p>
              <p className="text-sm text-red-700">kg CO₂e</p>
            </div>
          </div>
          
          {results.scope1Breakdown && (
            <div className="mt-4 pt-4 border-t border-red-200">
              <p className="text-sm font-semibold text-red-700 mb-3">{t('results.breakdown')}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-gray-600 mb-1">{t('calculator.energyCarriers')}</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatNumber(results.scope1Breakdown.energyCarriers)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">kg CO₂e</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-gray-600 mb-1">{t('calculator.fleet')}</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatNumber(results.scope1Breakdown.fleet)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">kg CO₂e</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-gray-600 mb-1">{t('calculator.refrigerants')}</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatNumber(results.scope1Breakdown.refrigerants)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">kg CO₂e</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scope 2 */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-yellow-800 flex items-center">
              <span className="mr-2">⚡</span>
              {t('calculator.scope2')}
            </h3>
            <div className="text-right">
              <p className="text-3xl font-bold text-yellow-600">
                {formatNumber(results.scope2Total)}
              </p>
              <p className="text-sm text-yellow-700">kg CO₂e</p>
            </div>
          </div>
          
          {results.scope2Breakdown && (
            <div className="mt-4 pt-4 border-t border-yellow-200">
              <p className="text-sm font-semibold text-yellow-700 mb-3">{t('results.breakdown')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-yellow-200">
                  <p className="text-sm text-gray-600 mb-1">{t('calculator.electricity')}</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {formatNumber(results.scope2Breakdown.electricity)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">kg CO₂e</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-yellow-200">
                  <p className="text-sm text-gray-600 mb-1">{t('calculator.districtHeating')}</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {formatNumber(results.scope2Breakdown.districtHeating)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">kg CO₂e</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scope 3 */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-blue-800 flex items-center">
              <span className="mr-2">🌍</span>
              {t('calculator.scope3')}
            </h3>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">
                {formatNumber(results.scope3Total)}
              </p>
              <p className="text-sm text-blue-700">kg CO₂e</p>
            </div>
          </div>
          
          {results.scope3Breakdown && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-sm font-semibold text-blue-700 mb-3">{t('results.breakdown')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">{t('calculator.waterSewage')}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatNumber(results.scope3Breakdown.waterAndSewage)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">kg CO₂e</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">{t('calculator.paperWaste')}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatNumber(results.scope3Breakdown.paperAndWaste)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">kg CO₂e</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">{t('calculator.airTravel')}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatNumber(results.scope3Breakdown.airTravel)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">kg CO₂e</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">{t('calculator.trainTravel')}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatNumber(results.scope3Breakdown.trainTravel)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">kg CO₂e</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
