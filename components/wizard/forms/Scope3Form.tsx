'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/lib/providers/locale';
import { useTranslations } from '@/lib/i18n';
import type { Scope3Input, AirTravelItem, TrainTravelItem } from '@/lib/models/calculation';

interface Scope3FormProps {
  data?: Scope3Input;
  onChange: (data: Scope3Input) => void;
  onCalculate: () => void;
  onPrevious: () => void;
  onDiscard?: () => void;
  isCalculating: boolean;
  readOnly?: boolean;
}

export default function Scope3Form({
  data,
  onChange,
  onCalculate,
  onPrevious,
  onDiscard,
  isCalculating,
  readOnly = false,
}: Scope3FormProps) {
  const { locale } = useLocale();
  const t = useTranslations(locale);

  // Initialize airTravel array - ensure at least one empty row
  const [airTravelItems, setAirTravelItems] = useState<AirTravelItem[]>(() => {
    if (data?.airTravel && data.airTravel.length > 0) {
      return data.airTravel;
    }
    return [{ name: '', distance: undefined }];
  });

  // Initialize trainTravel array - ensure at least one empty row
  const [trainTravelItems, setTrainTravelItems] = useState<TrainTravelItem[]>(() => {
    if (data?.trainTravel && data.trainTravel.length > 0) {
      return data.trainTravel;
    }
    return [{ name: '', distance: undefined }];
  });

  // Sync with data prop changes
  useEffect(() => {
    if (data?.airTravel && data.airTravel.length > 0) {
      setAirTravelItems(data.airTravel);
    } else if (!data?.airTravel) {
      setAirTravelItems([{ name: '', distance: undefined }]);
    }
  }, [data?.airTravel]);

  useEffect(() => {
    if (data?.trainTravel && data.trainTravel.length > 0) {
      setTrainTravelItems(data.trainTravel);
    } else if (!data?.trainTravel) {
      setTrainTravelItems([{ name: '', distance: undefined }]);
    }
  }, [data?.trainTravel]);

  const handleNumberChange = (value: string): number | undefined => {
    const num = parseFloat(value);
    if (isNaN(num)) return undefined;
    return num >= 0 ? num : 0;
  };

  const updateField = (field: keyof Scope3Input, value: string | number | AirTravelItem[] | TrainTravelItem[] | undefined) => {
    // For number fields, convert string to number
    const processedValue = 
      field === 'airTravel' || field === 'trainTravel'
        ? value 
        : typeof value === 'string' 
          ? handleNumberChange(value) 
          : value;
    
    onChange({
      ...data,
      [field]: processedValue,
    });
  };

  const updateAirTravelItem = (index: number, field: keyof AirTravelItem, value: string | number | undefined) => {
    const updated = [...airTravelItems];
    updated[index] = {
      ...updated[index],
      [field]: field === 'distance' ? (value === '' ? undefined : handleNumberChange(value as string)) : value,
    };
    setAirTravelItems(updated);
    updateField('airTravel', updated);
  };

  const addAirTravelItem = () => {
    const updated = [...airTravelItems, { name: '', distance: undefined }];
    setAirTravelItems(updated);
    updateField('airTravel', updated);
  };

  const removeAirTravelItem = (index: number) => {
    if (airTravelItems.length > 1) {
      const updated = airTravelItems.filter((_, i) => i !== index);
      setAirTravelItems(updated);
      updateField('airTravel', updated.length > 0 ? updated : undefined);
    }
  };

  const updateTrainTravelItem = (index: number, field: keyof TrainTravelItem, value: string | number | undefined) => {
    const updated = [...trainTravelItems];
    updated[index] = {
      ...updated[index],
      [field]: field === 'distance' ? (value === '' ? undefined : handleNumberChange(value as string)) : value,
    };
    setTrainTravelItems(updated);
    updateField('trainTravel', updated);
  };

  const addTrainTravelItem = () => {
    const updated = [...trainTravelItems, { name: '', distance: undefined }];
    setTrainTravelItems(updated);
    updateField('trainTravel', updated);
  };

  const removeTrainTravelItem = (index: number) => {
    if (trainTravelItems.length > 1) {
      const updated = trainTravelItems.filter((_, i) => i !== index);
      setTrainTravelItems(updated);
      updateField('trainTravel', updated.length > 0 ? updated : undefined);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1.5">
          {t('calculator.scope3Title')}
        </h2>
        <p className="text-gray-600">{t('calculator.scope3Description')}</p>
      </div>

      {/* Water & Sewage */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          {t('calculator.waterSewage')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('calculator.water')} (m³)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data?.water || ''}
              onChange={(e) => updateField('water', e.target.value)}
              disabled={readOnly}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('calculator.sewage')} (m³)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data?.sewage || ''}
              onChange={(e) => updateField('sewage', e.target.value)}
              disabled={readOnly}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Paper & Waste */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          {t('calculator.paperWaste')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('calculator.paperEcoLabeled')} (kg)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data?.paperEcoLabeled || ''}
              onChange={(e) => updateField('paperEcoLabeled', e.target.value)}
              disabled={readOnly}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('calculator.paperStandard')} (kg)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data?.paperStandard || ''}
              onChange={(e) => updateField('paperStandard', e.target.value)}
              disabled={readOnly}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('calculator.waste')} (kg)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data?.waste || ''}
              onChange={(e) => updateField('waste', e.target.value)}
              disabled={readOnly}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Business Travel */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          {t('calculator.businessTravel')}
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {t('calculator.airTravel')}
            </h4>
            <div className="space-y-3">
              {airTravelItems.map((item, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('calculator.flightName')}
                    </label>
                    <input
                      type="text"
                      value={item.name || ''}
                      onChange={(e) => updateAirTravelItem(index, 'name', e.target.value)}
                      disabled={readOnly}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder={t('calculator.flightName')}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('calculator.distance')} (km)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.distance || ''}
                      onChange={(e) => updateAirTravelItem(index, 'distance', e.target.value)}
                      disabled={readOnly}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="0"
                    />
                  </div>
                  {!readOnly && (
                    <div className="flex gap-2 items-end">
                      <button
                        type="button"
                        onClick={addAirTravelItem}
                        className="h-[38px] w-[38px] bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all flex items-center justify-center cursor-pointer"
                        title="Add flight"
                      >
                        <span className="text-white text-base leading-none filter brightness-0 invert">➕</span>
                      </button>
                      {airTravelItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAirTravelItem(index)}
                          className="h-[38px] w-[38px] bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all flex items-center justify-center cursor-pointer"
                          title="Remove flight"
                        >
                          <span className="text-white text-base leading-none filter brightness-0 invert">➖</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {t('calculator.trainTravel')}
            </h4>
            <div className="space-y-3">
              {trainTravelItems.map((item, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('calculator.flightName')}
                    </label>
                    <input
                      type="text"
                      value={item.name || ''}
                      onChange={(e) => updateTrainTravelItem(index, 'name', e.target.value)}
                      disabled={readOnly}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder={t('calculator.flightName')}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('calculator.distance')} (km)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.distance || ''}
                      onChange={(e) => updateTrainTravelItem(index, 'distance', e.target.value)}
                      disabled={readOnly}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="0"
                    />
                  </div>
                  {!readOnly && (
                    <div className="flex gap-2 items-end">
                      <button
                        type="button"
                        onClick={addTrainTravelItem}
                        className="h-[38px] w-[38px] bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all flex items-center justify-center cursor-pointer"
                        title="Add route"
                      >
                        <span className="text-white text-base leading-none filter brightness-0 invert">➕</span>
                      </button>
                      {trainTravelItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTrainTravelItem(index)}
                          className="h-[38px] w-[38px] bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all flex items-center justify-center cursor-pointer"
                          title="Remove route"
                        >
                          <span className="text-white text-base leading-none filter brightness-0 invert">➖</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
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
            onClick={onCalculate}
            disabled={isCalculating}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
          {isCalculating ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {t('calculator.calculating')}...
            </span>
          ) : (
            `📊 ${t('calculator.calculate')}`
          )}
          </button>
        </div>
      )}
    </div>
  );
}
