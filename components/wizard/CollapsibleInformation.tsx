'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/providers/locale';
import { useTranslations } from '@/lib/i18n';

export default function CollapsibleInformation() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale } = useLocale();
  const t = useTranslations(locale);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-green-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">ℹ️</span>
          <h2 className="text-xl font-bold text-gray-800">{t('information.title')}</h2>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="border-t border-gray-200">
          <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto bg-white">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t('information.aboutTitle')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('information.aboutDescription')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t('information.globalFormulaTitle')}</h3>
              <p className="text-gray-700 mb-2">
                {t('information.globalFormulaDescription')}
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm mb-2">
                CO2e = CO₂ + (CH₄ × 28) + (N₂O × 265)
              </div>
              <p className="text-sm text-gray-600">
                {t('information.globalFormulaExplanation')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-red-700 mb-3">{t('information.scope1InfoTitle')}</h3>
              <p className="text-gray-700 mb-3">
                {t('information.scope1InfoDescription')}
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('calculator.energyCarriers')}</h4>
                  <ul className="text-sm text-gray-700 space-y-2 ml-4">
                    <li>
                      <strong>{t('calculator.naturalGas')} (m³):</strong> {t('information.naturalGasFormula')}
                    </li>
                    <li>
                      <strong>{t('calculator.heatingOil')} (L):</strong> {t('information.heatingOilFormula')}
                    </li>
                    <li>
                      <strong>{t('calculator.coal')} (tonnes):</strong> {t('information.coalFormula')}
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('calculator.fleetGenerators')}</h4>
                  <ul className="text-sm text-gray-700 space-y-2 ml-4">
                    <li>
                      <strong>{t('calculator.gasoline')} (L):</strong> {t('information.gasolineFormula')}
                    </li>
                    <li>
                      <strong>{t('calculator.diesel')} - {t('calculator.fleet')} (L):</strong> {t('information.dieselFleetFormula')}
                    </li>
                    <li>
                      <strong>{t('calculator.diesel')} - {t('calculator.generators')} (L):</strong> {t('information.dieselGeneratorsFormula')}
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('calculator.refrigerants')}</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    {t('information.refrigerantsGWPNote')}
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li><strong>R407C:</strong> {t('information.r407cFormula')}</li>
                    <li><strong>R32:</strong> {t('information.r32Formula')}</li>
                    <li><strong>R410A:</strong> {t('information.r410aFormula')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-yellow-700 mb-3">{t('information.scope2InfoTitle')}</h3>
              <p className="text-gray-700 mb-3">
                {t('information.scope2InfoDescription')}
              </p>
              <ul className="text-sm text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>{t('calculator.electricity')} (kWh):</strong> {t('information.electricityFormula')}
                </li>
                <li>
                  <strong>{t('calculator.districtHeating')} (GJ):</strong> {t('information.districtHeatingFormula')}
                </li>
              </ul>
              <p className="text-xs text-gray-600 mt-2">
                {t('information.scope2Note')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-blue-700 mb-3">{t('information.scope3InfoTitle')}</h3>
              <p className="text-gray-700 mb-3">
                {t('information.scope3InfoDescription')}
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('calculator.waterSewage')}</h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li><strong>{t('calculator.water')}:</strong> {t('information.waterFormula')}</li>
                    <li><strong>{t('calculator.sewage')}:</strong> {t('information.sewageFormula')}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('calculator.paperWaste')}</h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li><strong>{t('calculator.paperEcoLabeled')}:</strong> {t('information.paperEcoLabeledFormula')}</li>
                    <li><strong>{t('calculator.paperStandard')}:</strong> {t('information.paperStandardFormula')}</li>
                    <li><strong>{t('calculator.waste')}:</strong> {t('information.wasteFormula')}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('calculator.businessTravel')} - {t('calculator.airTravel')}</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    {t('information.airTravelDescription')}
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 mb-3">
                    <li><strong>{t('calculator.shortHaul')}:</strong> &lt; 480 km</li>
                    <li><strong>{t('calculator.mediumHaul')}:</strong> 480 - 3680 km</li>
                    <li><strong>{t('calculator.longHaul')}:</strong> ≥ 3680 km</li>
                  </ul>
                  <p className="text-sm text-gray-700 mb-2">
                    {t('information.distanceConversionNote')}
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2">
                    <p className="text-xs font-semibold text-gray-800 mb-2">{t('calculator.shortHaul')} (&lt; 480 km):</p>
                    <ul className="text-xs text-gray-700 space-y-1 ml-4 font-mono">
                      {t('information.shortHaulFormula').split('\n').map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2">
                    <p className="text-xs font-semibold text-gray-800 mb-2">{t('calculator.mediumHaul')} (480 - 3680 km):</p>
                    <ul className="text-xs text-gray-700 space-y-1 ml-4 font-mono">
                      {t('information.mediumHaulFormula').split('\n').map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-800 mb-2">{t('calculator.longHaul')} (≥ 3680 km):</p>
                    <ul className="text-xs text-gray-700 space-y-1 ml-4 font-mono">
                      {t('information.longHaulFormula').split('\n').map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('calculator.businessTravel')} - {t('calculator.trainTravel')}</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    {t('information.trainTravelDescription')}
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <ul className="text-xs text-gray-700 space-y-1 ml-4 font-mono">
                      {t('information.trainTravelFormula').split('\n').map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">{t('information.importantNotesTitle')}</h4>
              <ul className="text-sm text-green-700 space-y-1 ml-4">
                <li>{t('information.note1')}</li>
                <li>{t('information.note2')}</li>
                <li>{t('information.note3')}</li>
                <li>{t('information.note4')}</li>
                <li>{t('information.note5')}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
