'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/providers/locale';
import { useTranslations } from '@/lib/i18n';
import { useAuth } from '@/lib/providers/auth';
import type { CarbonFootprintInput, CarbonFootprintOutput } from '@/lib/models/calculation';
import CollapsibleInformation from '@/components/wizard/CollapsibleInformation';
import CalculationNameModal from '@/components/wizard/modals/CalculationNameModal';
import Scope1Form from './forms/Scope1Form';
import Scope2Form from './forms/Scope2Form';
import Scope3Form from './forms/Scope3Form';
import ResultsView from './ResultsView';

type Tab = 'scope1' | 'scope2' | 'scope3' | 'results';

interface CarbonFootprintWizardProps {
  onBackToList: () => void;
  onShowToast?: (message: string, type: 'success' | 'error') => void;
}

export default function CarbonFootprintWizard({ onBackToList, onShowToast }: CarbonFootprintWizardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('scope1');
  const [formData, setFormData] = useState<CarbonFootprintInput>({});
  const [results, setResults] = useState<CarbonFootprintOutput | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const { getAuthHeaders } = useAuth();

  const handleScope1Change = (data: CarbonFootprintInput['scope1']) => {
    setFormData((prev) => ({ ...prev, scope1: data }));
  };

  const handleScope2Change = (data: CarbonFootprintInput['scope2']) => {
    setFormData((prev) => ({ ...prev, scope2: data }));
  };

  const handleScope3Change = (data: CarbonFootprintInput['scope3']) => {
    setFormData((prev) => ({ ...prev, scope3: data }));
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Calculation failed');
      }

      const data = await response.json();
      setResults(data);
      setActiveTab('results');
    } catch (error) {
      console.error('Calculation error:', error);
      alert(t('calculator.calculationError'));
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setFormData({});
    setResults(null);
    setActiveTab('scope1');
    onBackToList();
  };

  const handleSaveClick = () => {
    if (!results) return;
    setIsNameModalOpen(true);
  };

  const handleSave = async (name: string) => {
    if (!results) return;

    try {
      const response = await fetch('/api/calculations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          name: name.trim(),
          input_data: formData,
          result_data: results,
        }),
      });

      if (!response.ok) {
        throw new Error('Save failed');
      }

      setIsNameModalOpen(false);
      if (onShowToast) {
        onShowToast(t('common.saveCalculationSuccess'), 'success');
      }
      setTimeout(() => {
        onBackToList();
      }, 500);
    } catch (error) {
      console.error('Save error:', error);
      if (onShowToast) {
        onShowToast(t('common.saveCalculationError'), 'error');
      }
    }
  };

  const tabs = [
    { id: 'scope1' as Tab, label: t('calculator.scope1'), icon: '🔥' },
    { id: 'scope2' as Tab, label: t('calculator.scope2'), icon: '⚡' },
    { id: 'scope3' as Tab, label: t('calculator.scope3'), icon: '🌍' },
  ];

  return (
    <div className="space-y-6">
      <CollapsibleInformation />
      <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
          {results && (
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-4 text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'results'
                  ? 'bg-white text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <span className="mr-2">📊</span>
              {t('calculator.results')}
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'scope1' && (
          <Scope1Form
            data={formData.scope1}
            onChange={handleScope1Change}
            onNext={() => setActiveTab('scope2')}
            onDiscard={handleReset}
          />
        )}
        {activeTab === 'scope2' && (
          <Scope2Form
            data={formData.scope2}
            onChange={handleScope2Change}
            onNext={() => setActiveTab('scope3')}
            onPrevious={() => setActiveTab('scope1')}
            onDiscard={handleReset}
          />
        )}
        {activeTab === 'scope3' && (
          <Scope3Form
            data={formData.scope3}
            onChange={handleScope3Change}
            onCalculate={handleCalculate}
            onPrevious={() => setActiveTab('scope2')}
            onDiscard={handleReset}
            isCalculating={isCalculating}
          />
        )}
        {activeTab === 'results' && results && (
          <ResultsView
            results={results}
            onReset={handleReset}
            onBack={() => setActiveTab('scope3')}
            onSave={handleSaveClick}
          />
        )}
      </div>
      </div>
      
      <CalculationNameModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        onConfirm={handleSave}
      />
    </div>
  );
}
