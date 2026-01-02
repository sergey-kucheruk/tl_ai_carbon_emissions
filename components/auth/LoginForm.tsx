'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/providers/auth';
import { useLocale } from '@/lib/providers/locale';
import { useTranslations } from '@/lib/i18n';
import type { UserType } from '@/lib/models/user';

type FormMode = 'login' | 'signup';

export default function LoginForm() {
  const [mode, setMode] = useState<FormMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('personal');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const { locale } = useLocale();
  const t = useTranslations(locale);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(email, password);
        if (!result.success) {
          setError(result.error || t('auth.invalidCredentials'));
        }
      } else {
        // Signup
        if (userType === 'personal') {
          if (!firstName || !lastName) {
            setError(t('auth.firstNameRequired'));
            setIsLoading(false);
            return;
          }
          const result = await signup({
            email,
            password,
            user_type: 'personal',
            first_name: firstName,
            last_name: lastName,
          });
          if (!result.success) {
            setError(result.error || t('auth.signupError'));
          }
        } else {
          // Business
          if (!businessName) {
            setError(t('auth.businessNameRequired'));
            setIsLoading(false);
            return;
          }
          const result = await signup({
            email,
            password,
            user_type: 'business',
            business_name: businessName,
            business_description: businessDescription,
          });
          if (!result.success) {
            setError(result.error || t('auth.signupError'));
          }
        }
      }
    } catch (err) {
      setError(mode === 'login' ? t('auth.invalidCredentials') : t('auth.signupError'));
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    // Reset form fields
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setBusinessName('');
    setBusinessDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-green-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {mode === 'login' ? t('auth.loginTitle') : t('auth.signupTitle')}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              {mode === 'login' ? t('auth.loginSubtitle') : t('auth.signupSubtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.userType')}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="personal"
                      checked={userType === 'personal'}
                      onChange={(e) => setUserType(e.target.value as UserType)}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    {t('auth.personal')}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="business"
                      checked={userType === 'business'}
                      onChange={(e) => setUserType(e.target.value as UserType)}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    {t('auth.business')}
                  </label>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {mode === 'signup' && userType === 'personal' && (
              <>
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('auth.firstName')}
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('auth.lastName')}
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </>
            )}

            {mode === 'signup' && userType === 'business' && (
              <>
                <div>
                  <label
                    htmlFor="businessName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('auth.businessName')}
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="businessDescription"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('auth.businessDescription')}
                  </label>
                  <textarea
                    id="businessDescription"
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
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
                  {mode === 'login' ? t('auth.login') : t('auth.signup')}...
                </span>
              ) : (
                mode === 'login' ? t('auth.login') : t('auth.signup')
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              {mode === 'login' ? (
                <>
                  {t('auth.dontHaveAccount')}{' '}
                  <button
                    type="button"
                    onClick={switchMode}
                    className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
                  >
                    {t('auth.signup')}
                  </button>
                </>
              ) : (
                <>
                  {t('auth.alreadyHaveAccount')}{' '}
                  <button
                    type="button"
                    onClick={switchMode}
                    className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
                  >
                    {t('auth.login')}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
