'use client';

import type { CalculationInfo } from '@/lib/models/calculation';
import { useLocale } from '@/lib/providers/locale';
import { useTranslations } from '@/lib/i18n';

interface CalculationsListViewProps {
  calculations: CalculationInfo[];
  onSelectCalculation: (id: number) => void;
}

export function CalculationsListView({
  calculations,
  onSelectCalculation,
}: CalculationsListViewProps) {
  const { locale } = useLocale();
  const t = useTranslations(locale);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat(locale === 'en' ? 'en-US' : locale, {
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-3">
      {calculations.map((calc) => (
        <button
          key={calc.id}
          onClick={() => onSelectCalculation(calc.id)}
          className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-800">{calc.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {formatDate(calc.created_at)}
              </p>
              {calc.result_data && (
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
                  <span className="text-emerald-600">
                    {t('results.totalFootprint')}:{' '}
                    {formatNumber(calc.result_data.totalFootprint)} kg CO₂e
                  </span>
                  <span className="text-red-600">
                    {t('calculator.scope1')}:{' '}
                    {formatNumber(calc.result_data.scope1Total)} kg CO₂e
                  </span>
                  <span className="text-amber-600">
                    {t('calculator.scope2')}:{' '}
                    {formatNumber(calc.result_data.scope2Total)} kg CO₂e
                  </span>
                  <span className="text-blue-600">
                    {t('calculator.scope3')}:{' '}
                    {formatNumber(calc.result_data.scope3Total)} kg CO₂e
                  </span>
                </div>
              )}
            </div>
            <svg
              className="w-5 h-5 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
      ))}
    </div>
  );
}

