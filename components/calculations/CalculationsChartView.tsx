'use client';

import { useMemo, useState, useEffect } from 'react';
import type { CalculationInfo } from '@/lib/models/calculation';
import { useLocale } from '@/lib/providers/locale';
import { useTranslations } from '@/lib/i18n';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface CalculationsChartViewProps {
  calculations: CalculationInfo[];
  onSelectCalculation: (id: number) => void;
}

type ScaleMode = 'linear' | 'log';
type ChartType = 'bar' | 'line';

const SCALE_MODE_STORAGE_KEY = 'calculationsChartScaleMode';
const CHART_TYPE_STORAGE_KEY = 'calculationsChartType';

export function CalculationsChartView({
  calculations,
  onSelectCalculation,
}: CalculationsChartViewProps) {
  const { locale } = useLocale();
  const t = useTranslations(locale);

  const formatShortDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : locale, {
      year: '2-digit',
      month: 'short',
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

  const [scaleMode, setScaleMode] = useState<ScaleMode>('log');
  const [chartType, setChartType] = useState<ChartType>('bar');

  // Restore persisted chart settings
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedScale = window.localStorage.getItem(
      SCALE_MODE_STORAGE_KEY,
    ) as ScaleMode | null;
    const storedType = window.localStorage.getItem(
      CHART_TYPE_STORAGE_KEY,
    ) as ChartType | null;

    if (storedScale === 'linear' || storedScale === 'log') {
      setScaleMode(storedScale);
    }
    if (storedType === 'bar' || storedType === 'line') {
      setChartType(storedType);
    }
  }, []);

  const chartData = useMemo(
    () =>
      calculations
        .filter((calc) => calc.result_data)
        .slice()
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
        .map((calc) => {
          const { totalFootprint, scope1Total, scope2Total, scope3Total } =
            calc.result_data;

          const makeValue = (value: number) =>
            scaleMode === 'log' ? (value > 0 ? value : 0.1) : value;

          return {
            id: calc.id,
            name: calc.name,
            date: formatShortDate(calc.created_at),
            total: makeValue(totalFootprint),
            scope1: makeValue(scope1Total),
            scope2: makeValue(scope2Total),
            scope3: makeValue(scope3Total),
          };
        }),
    [calculations, locale, scaleMode],
  );

  const handleBarClick = (data: { id?: number }) => {
    if (data && typeof data.id === 'number') {
      onSelectCalculation(data.id);
    }
  };

  const handleChartClick = (state: {
    activeTooltipIndex?: number | null;
  }) => {
    if (
      !state ||
      state.activeTooltipIndex === undefined ||
      state.activeTooltipIndex === null
    ) {
      return;
    }

    const index = state.activeTooltipIndex;
    const item = chartData[index];
    if (item) {
      handleBarClick(item);
    }
  };

  return (
    <div className="h-[32rem] w-full cursor-pointer flex flex-col">
      <div className="flex justify-between items-center mb-2 gap-3">
        <div className="inline-flex rounded-lg border border-green-200 bg-white overflow-hidden shadow-sm text-xs">
          <button
            type="button"
            onClick={() => {
              setChartType('bar');
              if (typeof window !== 'undefined') {
                window.localStorage.setItem(CHART_TYPE_STORAGE_KEY, 'bar');
              }
            }}
            className={`px-3 py-1.5 font-medium transition-all cursor-pointer ${
              chartType === 'bar'
                ? 'bg-green-500 text-white'
                : 'text-gray-700 hover:bg-green-50'
            }`}
          >
            {t('calculations.chartTypeBar')}
          </button>
          <button
            type="button"
            onClick={() => {
              setChartType('line');
              if (typeof window !== 'undefined') {
                window.localStorage.setItem(CHART_TYPE_STORAGE_KEY, 'line');
              }
            }}
            className={`px-3 py-1.5 font-medium border-l border-green-200 transition-all cursor-pointer ${
              chartType === 'line'
                ? 'bg-green-500 text-white'
                : 'text-gray-700 hover:bg-green-50'
            }`}
          >
            {t('calculations.chartTypeLine')}
          </button>
        </div>
        <div className="inline-flex rounded-lg border border-green-200 bg-white overflow-hidden shadow-sm text-xs">
          <button
            type="button"
            onClick={() => {
              setScaleMode('linear');
              if (typeof window !== 'undefined') {
                window.localStorage.setItem(SCALE_MODE_STORAGE_KEY, 'linear');
              }
            }}
            className={`px-3 py-1.5 font-medium transition-all cursor-pointer ${
              scaleMode === 'linear'
                ? 'bg-green-500 text-white'
                : 'text-gray-700 hover:bg-green-50'
            }`}
          >
            {t('calculations.scaleLinear')}
          </button>
          <button
            type="button"
            onClick={() => {
              setScaleMode('log');
              if (typeof window !== 'undefined') {
                window.localStorage.setItem(SCALE_MODE_STORAGE_KEY, 'log');
              }
            }}
            className={`px-3 py-1.5 font-medium border-l border-green-200 transition-all cursor-pointer ${
              scaleMode === 'log'
                ? 'bg-green-500 text-white'
                : 'text-gray-700 hover:bg-green-50'
            }`}
          >
            {t('calculations.scaleLog')}
          </button>
        </div>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
              onClick={handleChartClick}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#4b5563' }}
                angle={-35}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#4b5563' }}
                scale={scaleMode === 'log' ? 'log' : 'auto'}
                domain={scaleMode === 'log' ? ['auto', 'auto'] : ['auto', 'auto']}
                tickFormatter={(value: number) => formatNumber(value)}
              />
              <Tooltip
                formatter={(value: unknown, name: string) => {
                  const numeric = Number(value as number);
                  const displayValue = numeric < 0.5 ? 0 : numeric;

                  return [
                    `${formatNumber(displayValue)} kg CO₂e`,
                    name === 'total'
                      ? t('results.totalFootprint')
                      : name === 'scope1'
                      ? t('calculator.scope1')
                      : name === 'scope2'
                      ? t('calculator.scope2')
                      : t('calculator.scope3'),
                  ];
                }}
                labelFormatter={(_: string, payload: any[]) =>
                  payload && payload[0]
                    ? `${payload[0].payload.name} - ${payload[0].payload.date}`
                    : ''
                }
              />
              <Legend
                verticalAlign="top"
                align="center"
                wrapperStyle={{ paddingBottom: 16 }}
                formatter={(value: string) =>
                  value === 'total'
                    ? t('results.totalFootprint')
                    : value === 'scope1'
                    ? t('calculator.scope1')
                    : value === 'scope2'
                    ? t('calculator.scope2')
                    : t('calculator.scope3')
                }
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#059669" // emerald-600
                name="total"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="scope1"
                stroke="#dc2626" // red-600
                name="scope1"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="scope2"
                stroke="#d97706" // amber-600
                name="scope2"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="scope3"
                stroke="#2563eb" // blue-600
                name="scope3"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
              onClick={handleChartClick}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#4b5563' }}
                angle={-35}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#4b5563' }}
                scale={scaleMode === 'log' ? 'log' : 'auto'}
                domain={scaleMode === 'log' ? ['auto', 'auto'] : ['auto', 'auto']}
                tickFormatter={(value: number) => formatNumber(value)}
              />
              <Tooltip
                formatter={(value: unknown, name: string) => {
                  const numeric = Number(value as number);
                  const displayValue = numeric < 0.5 ? 0 : numeric;

                  return [
                    `${formatNumber(displayValue)} kg CO₂e`,
                    name === 'total'
                      ? t('results.totalFootprint')
                      : name === 'scope1'
                      ? t('calculator.scope1')
                      : name === 'scope2'
                      ? t('calculator.scope2')
                      : t('calculator.scope3'),
                  ];
                }}
                labelFormatter={(_: string, payload: any[]) =>
                  payload && payload[0]
                    ? `${payload[0].payload.name} - ${payload[0].payload.date}`
                    : ''
                }
              />
              <Legend
                verticalAlign="top"
                align="center"
                wrapperStyle={{ paddingBottom: 16 }}
                formatter={(value: string) =>
                  value === 'total'
                    ? t('results.totalFootprint')
                    : value === 'scope1'
                    ? t('calculator.scope1')
                    : value === 'scope2'
                    ? t('calculator.scope2')
                    : t('calculator.scope3')
                }
              />
              <Bar
                dataKey="total"
                fill="#059669" // emerald-600
                name="total"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="scope1"
                fill="#dc2626" // red-600
                name="scope1"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="scope2"
                fill="#d97706" // amber-600
                name="scope2"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="scope3"
                fill="#2563eb" // blue-600
                name="scope3"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

