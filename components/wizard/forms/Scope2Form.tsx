'use client';

import { useLocale } from '@/lib/providers/locale';
import { useTranslations } from '@/lib/i18n';
import type { Scope2Input } from '@/lib/models/calculation';

interface Scope2FormProps {
  data?: Scope2Input;
  onChange: (data: Scope2Input) => void;
  onNext: () => void;
  onPrevious: () => void;
  onDiscard?: () => void;
  readOnly?: boolean;
}

export default function Scope2Form({ data, onChange, onNext, onPrevious, onDiscard, readOnly = false }: Scope2FormProps) {
  const { locale } = useLocale();
  const t = useTranslations(locale);

  const handleNumberChange = (value: string): number | undefined => {
    const num = parseFloat(value);
    if (isNaN(num)) return undefined;
    return num >= 0 ? num : 0;
  };

  const updateField = (field: keyof Scope2Input, value: string) => {
    const numValue = handleNumberChange(value);
    onChange({
      ...data,
      [field]: numValue,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1.5">
          {t('calculator.scope2Title')}
        </h2>
        <p className="text-gray-600">{t('calculator.scope2Description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Electricity */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            {t('calculator.electricity')}
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('calculator.electricityConsumption')} (kWh)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data?.electricity || ''}
              onChange={(e) => updateField('electricity', e.target.value)}
              disabled={readOnly}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
        </div>

        {/* District Heating */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            {t('calculator.districtHeating')}
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('calculator.districtHeatingConsumption')} (GJ)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data?.districtHeating || ''}
              onChange={(e) => updateField('districtHeating', e.target.value)}
              disabled={readOnly}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {!readOnly && (
        <div className="flex justify-between">
          <div className="flex gap-2">
            <button
              onClick={onPrevious}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all cursor-pointer"
            >
              ← {t('calculator.previous')}
            </button>
            {onDiscard && (
              <button
                onClick={onDiscard}
                className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all shadow-lg cursor-pointer"
              >
                {t('calculator.discard')}
              </button>
            )}
          </div>
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
