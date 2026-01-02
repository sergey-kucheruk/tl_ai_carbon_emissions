'use client';

import { useLocale } from '@/lib/providers/locale';
import { useTranslations } from '@/lib/i18n';
import type { Scope1Input } from '@/lib/models/calculation';

interface Scope1FormProps {
  data?: Scope1Input;
  onChange: (data: Scope1Input) => void;
  onNext: () => void;
  onDiscard?: () => void;
  readOnly?: boolean;
}

export default function Scope1Form({ data, onChange, onNext, onDiscard, readOnly = false }: Scope1FormProps) {
  const { locale } = useLocale();
  const t = useTranslations(locale);

  const handleNumberChange = (value: string): number | undefined => {
    const num = parseFloat(value);
    if (isNaN(num)) return undefined;
    return num >= 0 ? num : 0;
  };

  const updateEnergyCarriers = (field: string, value: string) => {
    const numValue = handleNumberChange(value);
    onChange({
      ...data,
      energyCarriers: {
        ...data?.energyCarriers,
        [field]: numValue,
      },
    });
  };

  const updateFleet = (field: string, value: string) => {
    const numValue = handleNumberChange(value);
    onChange({
      ...data,
      fleet: {
        ...data?.fleet,
        [field]: numValue,
      },
    });
  };

  const updateRefrigerants = (field: string, value: string) => {
    const numValue = handleNumberChange(value);
    onChange({
      ...data,
      refrigerants: {
        ...data?.refrigerants,
        [field]: numValue,
      },
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1.5">
          {t('calculator.scope1Title')}
        </h2>
        <p className="text-gray-600">{t('calculator.scope1Description')}</p>
      </div>

      {/* Energy Carriers */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          {t('calculator.energyCarriers')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('calculator.naturalGas')} (m³)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data?.energyCarriers?.naturalGas || ''}
              onChange={(e) => updateEnergyCarriers('naturalGas', e.target.value)}
              disabled={readOnly}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('calculator.heatingOil')} (L)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data?.energyCarriers?.heatingOil || ''}
              onChange={(e) => updateEnergyCarriers('heatingOil', e.target.value)}
              disabled={readOnly}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('calculator.coal')} (t)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data?.energyCarriers?.coal || ''}
              onChange={(e) => updateEnergyCarriers('coal', e.target.value)}
              disabled={readOnly}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Fleet & Generators */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          {t('calculator.fleetGenerators')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('calculator.gasoline')} (L)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data?.fleet?.gasoline || ''}
              onChange={(e) => updateFleet('gasoline', e.target.value)}
              disabled={readOnly}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('calculator.diesel')} (L)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data?.fleet?.diesel || ''}
              onChange={(e) => updateFleet('diesel', e.target.value)}
              disabled={readOnly}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('calculator.dieselGenerators')} (L)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data?.fleet?.dieselGenerators || ''}
              onChange={(e) => updateFleet('dieselGenerators', e.target.value)}
              disabled={readOnly}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Refrigerants */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          {t('calculator.refrigerants')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              R407C (kg)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data?.refrigerants?.r407c || ''}
              onChange={(e) => updateRefrigerants('r407c', e.target.value)}
              disabled={readOnly}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              R32 (kg)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data?.refrigerants?.r32 || ''}
              onChange={(e) => updateRefrigerants('r32', e.target.value)}
              disabled={readOnly}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              R410A (kg)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data?.refrigerants?.r410a || ''}
              onChange={(e) => updateRefrigerants('r410a', e.target.value)}
              disabled={readOnly}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {!readOnly && (
        <div className="flex justify-between">
          {onDiscard ? (
            <button
              onClick={onDiscard}
              className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all shadow-lg cursor-pointer"
            >
              {t('calculator.discard')}
            </button>
          ) : (
            <div></div>
          )}
          <button
            onClick={onNext}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-lg cursor-pointer"
          >
            {t('calculator.next')} →
          </button>
        </div>
      )}
    </div>
  );
}
