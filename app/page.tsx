'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/providers/auth';
import LoginForm from '@/components/auth/LoginForm';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import CarbonFootprintWizard from '@/components/wizard/CarbonFootprintWizard';
import PreviousCalculations from '@/components/calculations/PreviousCalculations';
import CalculationView from '@/components/wizard/CalculationView';
import Toast from '@/components/common/Toast';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/lib/providers/locale';

type ViewMode = 'list' | 'wizard' | 'view';

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCalculationId, setSelectedCalculationId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="min-h-screen blur-sm">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-800 mb-4">
                {t('app.title')}
              </h1>
              <p className="text-xl text-gray-600">
                {t('app.subtitle')}
              </p>
            </div>
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
              <p className="text-gray-600">
                {t('app.mainContentPlaceholder')}
              </p>
            </div>
          </div>
        </div>
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {t('app.welcome')}, {user?.user_type === 'personal' 
                ? `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email
                : user?.business_name || user?.email}
            </h1>
            <p className="text-gray-600 mt-1">{t('app.title')}</p>
            {user?.user_type === 'business' && user?.business_description && (
              <p className="text-sm text-gray-500 mt-1">{user.business_description}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={logout}
              className="px-4 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
            >
              {t('app.logout')}
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto">
          {viewMode === 'list' && user && (
            <PreviousCalculations
              onSelectCalculation={(id) => {
                setSelectedCalculationId(id);
                setViewMode('view');
              }}
              onNewCalculation={() => {
                setSelectedCalculationId(null);
                setViewMode('wizard');
              }}
            />
          )}
          {viewMode === 'wizard' && user && (
            <CarbonFootprintWizard
              onBackToList={() => setViewMode('list')}
              onShowToast={(message, type) => setToast({ message, type })}
            />
          )}
          {viewMode === 'view' && user && selectedCalculationId && (
            <CalculationView
              calculationId={selectedCalculationId}
              onBackToList={() => setViewMode('list')}
            />
          )}
        </main>
      </div>
      
      <Toast
        message={toast?.message || ''}
        type={toast?.type || 'success'}
        isVisible={!!toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
