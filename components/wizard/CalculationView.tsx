'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/lib/providers/locale';
import { useTranslations } from '@/lib/i18n';
import { useAuth } from '@/lib/providers/auth';
import type { CarbonFootprintInput, CarbonFootprintOutput } from '@/lib/models/calculation';
import ResultsView from './ResultsView';
import Scope1Form from './forms/Scope1Form';
import Scope2Form from './forms/Scope2Form';
import Scope3Form from './forms/Scope3Form';

type Tab = 'scope1' | 'scope2' | 'scope3' | 'results';

interface CalculationViewProps {
  calculationId: number;
  onBackToList: () => void;
}

export default function CalculationView({
  calculationId,
  onBackToList,
}: CalculationViewProps) {
  const [results, setResults] = useState<CarbonFootprintOutput | null>(null);
  const [inputData, setInputData] = useState<CarbonFootprintInput | null>(null);
  const [calculationName, setCalculationName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('results');
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    const fetchCalculation = async () => {
      try {
        const response = await fetch(`/api/calculations/${calculationId}`, {
          headers: {
            ...getAuthHeaders(),
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.calculation) {
            setResults(data.calculation.result_data);
            setInputData(data.calculation.input_data);
            setCalculationName(data.calculation.name);
          }
        }
      } catch (error) {
        console.error('Failed to load calculation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (calculationId) {
      fetchCalculation();
    }
  }, [calculationId, getAuthHeaders]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!results || !inputData) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8 text-center">
        <p className="text-gray-600">Calculation not found</p>
        <button
          onClick={onBackToList}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all cursor-pointer"
        >
          ← {t('calculator.back')}
        </button>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'scope1', label: t('calculator.scope1Title') },
    { id: 'scope2', label: t('calculator.scope2Title') },
    { id: 'scope3', label: t('calculator.scope3Title') },
    { id: 'results', label: t('calculator.results') },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{calculationName}</h2>
            <p className="text-sm text-gray-600 mt-1">{t('calculations.viewCalculation')}</p>
          </div>
          <button
            onClick={onBackToList}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all cursor-pointer"
          >
            ← {t('calculator.back')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600 bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'scope1' && (
          <Scope1Form
            data={inputData.scope1}
            onChange={() => {}}
            onNext={() => setActiveTab('scope2')}
            readOnly={true}
          />
        )}
        {activeTab === 'scope2' && (
          <Scope2Form
            data={inputData.scope2}
            onChange={() => {}}
            onNext={() => setActiveTab('scope3')}
            onPrevious={() => setActiveTab('scope1')}
            readOnly={true}
          />
        )}
        {activeTab === 'scope3' && (
          <Scope3Form
            data={inputData.scope3}
            onChange={() => {}}
            onCalculate={() => setActiveTab('results')}
            onPrevious={() => setActiveTab('scope2')}
            isCalculating={false}
            readOnly={true}
          />
        )}
        {activeTab === 'results' && (
          <ResultsView
            results={results}
            onReset={onBackToList}
            onBack={() => setActiveTab('scope3')}
            isReadOnly={true}
          />
        )}
      </div>
    </div>
  );
}
