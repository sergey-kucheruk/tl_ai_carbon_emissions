import jsPDF from 'jspdf';
import type { CarbonFootprintOutput } from '../models/calculation';

interface PDFOptions {
  locale?: string;
  translations?: {
    resultsTitle: string;
    totalFootprint: string;
    scope1: string;
    scope2: string;
    scope3: string;
    breakdown: string;
    energyCarriers: string;
    fleet: string;
    refrigerants: string;
    electricity: string;
    districtHeating: string;
    waterSewage: string;
    paperWaste: string;
    airTravel: string;
    trainTravel: string;
    kgCO2e: string;
    generatedOn: string;
  };
}

const formatNumber = (num: number, locale: string = 'en'): string => {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export function generatePDF(
  results: CarbonFootprintOutput,
  options: PDFOptions = {}
): void {
  const {
    locale = 'en',
    translations = {
      resultsTitle: 'Carbon Footprint Results',
      totalFootprint: 'Total Carbon Footprint',
      scope1: 'Scope 1',
      scope2: 'Scope 2',
      scope3: 'Scope 3',
      breakdown: 'Breakdown',
      energyCarriers: 'Energy Carriers',
      fleet: 'Fleet',
      refrigerants: 'Refrigerants',
      electricity: 'Electricity',
      districtHeating: 'District Heating',
      waterSewage: 'Water & Sewage',
      paperWaste: 'Paper & Waste',
      airTravel: 'Air Travel',
      trainTravel: 'Train Travel',
      kgCO2e: 'kg CO2e',
      generatedOn: 'Generated on',
    },
  } = options;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 25;
  const margin = 20;
  const lineSpacing = 8;

  // Title
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  const titleWidth = doc.getTextWidth(translations.resultsTitle);
  doc.text(translations.resultsTitle, (pageWidth - titleWidth) / 2, yPosition);
  yPosition += 10;

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const dateText = `${translations.generatedOn}: ${currentDate}`;
  const dateWidth = doc.getTextWidth(dateText);
  doc.text(dateText, (pageWidth - dateWidth) / 2, yPosition);
  yPosition += 20;

  // Total Footprint
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(translations.totalFootprint, margin, yPosition);
  yPosition += lineSpacing + 3;

  doc.setFontSize(28);
  doc.setTextColor(34, 197, 94); // green
  doc.setFont('helvetica', 'bold');
  doc.text(`${formatNumber(results.totalFootprint)} ${translations.kgCO2e}`, margin, yPosition);
  yPosition += 25;

  // Scope 1
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = 25;
  }

  doc.setFontSize(16);
  doc.setTextColor(220, 38, 38); // red
  doc.setFont('helvetica', 'bold');
  doc.text(translations.scope1, margin, yPosition);
  yPosition += lineSpacing;

  doc.setFontSize(20);
  doc.setTextColor(220, 38, 38); // red
  doc.setFont('helvetica', 'bold');
  doc.text(`${formatNumber(results.scope1Total)} ${translations.kgCO2e}`, margin, yPosition);
  yPosition += lineSpacing + 3;

  if (results.scope1Breakdown) {
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`${translations.breakdown}:`, margin + 5, yPosition);
    yPosition += lineSpacing;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `  ${translations.energyCarriers}: ${formatNumber(results.scope1Breakdown.energyCarriers)} ${translations.kgCO2e}`,
      margin + 5,
      yPosition
    );
    yPosition += lineSpacing - 2;
    doc.text(
      `  ${translations.fleet}: ${formatNumber(results.scope1Breakdown.fleet)} ${translations.kgCO2e}`,
      margin + 5,
      yPosition
    );
    yPosition += lineSpacing - 2;
    doc.text(
      `  ${translations.refrigerants}: ${formatNumber(results.scope1Breakdown.refrigerants)} ${translations.kgCO2e}`,
      margin + 5,
      yPosition
    );
    yPosition += 15;
  } else {
    yPosition += 10;
  }

  // Scope 2
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = 25;
  }

  doc.setFontSize(16);
  doc.setTextColor(234, 179, 8); // yellow/orange
  doc.setFont('helvetica', 'bold');
  doc.text(translations.scope2, margin, yPosition);
  yPosition += lineSpacing;

  doc.setFontSize(20);
  doc.setTextColor(234, 179, 8); // yellow/orange
  doc.setFont('helvetica', 'bold');
  doc.text(`${formatNumber(results.scope2Total)} ${translations.kgCO2e}`, margin, yPosition);
  yPosition += lineSpacing + 3;

  if (results.scope2Breakdown) {
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`${translations.breakdown}:`, margin + 5, yPosition);
    yPosition += lineSpacing;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `  ${translations.electricity}: ${formatNumber(results.scope2Breakdown.electricity)} ${translations.kgCO2e}`,
      margin + 5,
      yPosition
    );
    yPosition += lineSpacing - 2;
    doc.text(
      `  ${translations.districtHeating}: ${formatNumber(results.scope2Breakdown.districtHeating)} ${translations.kgCO2e}`,
      margin + 5,
      yPosition
    );
    yPosition += 15;
  } else {
    yPosition += 10;
  }

  // Scope 3
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = 25;
  }

  doc.setFontSize(16);
  doc.setTextColor(37, 99, 235); // blue
  doc.setFont('helvetica', 'bold');
  doc.text(translations.scope3, margin, yPosition);
  yPosition += lineSpacing;

  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // blue
  doc.setFont('helvetica', 'bold');
  doc.text(`${formatNumber(results.scope3Total)} ${translations.kgCO2e}`, margin, yPosition);
  yPosition += lineSpacing + 3;

  if (results.scope3Breakdown) {
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`${translations.breakdown}:`, margin + 5, yPosition);
    yPosition += lineSpacing;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `  ${translations.waterSewage}: ${formatNumber(results.scope3Breakdown.waterAndSewage)} ${translations.kgCO2e}`,
      margin + 5,
      yPosition
    );
    yPosition += lineSpacing - 2;
    doc.text(
      `  ${translations.paperWaste}: ${formatNumber(results.scope3Breakdown.paperAndWaste)} ${translations.kgCO2e}`,
      margin + 5,
      yPosition
    );
    yPosition += lineSpacing - 2;
    doc.text(
      `  ${translations.airTravel}: ${formatNumber(results.scope3Breakdown.airTravel)} ${translations.kgCO2e}`,
      margin + 5,
      yPosition
    );
    yPosition += lineSpacing - 2;
    doc.text(
      `  ${translations.trainTravel}: ${formatNumber(results.scope3Breakdown.trainTravel)} ${translations.kgCO2e}`,
      margin + 5,
      yPosition
    );
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `carbon-footprint-${timestamp}.pdf`;

  // Save the PDF
  doc.save(filename);
}
