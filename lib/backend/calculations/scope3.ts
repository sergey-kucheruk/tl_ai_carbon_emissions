import { calculateCO2e } from './co2e';
import type { Scope3Input, AirTravelItem, TrainTravelItem } from '../../models/calculation';
import {
  DISTANCE_CONVERSION,
  WATER_SEWAGE_EMISSIONS,
  PAPER_WASTE_EMISSIONS,
  AIR_TRAVEL_EMISSIONS,
  AIR_TRAVEL_THRESHOLDS,
  TRAIN_TRAVEL_EMISSIONS,
} from './constants';

/**
 * Scope 3: Other Indirect Emissions
 */

// Water & Sewage
function calculateWaterAndSewage(input: {
  water?: number;
  sewage?: number;
}): number {
  let totalCO2e = 0;

  // Water: m3 * emission factor = kg CO2e
  if (input.water) {
    totalCO2e += input.water * WATER_SEWAGE_EMISSIONS.WATER_KG_CO2E_PER_M3;
  }

  // Sewage: m3 * emission factor = kg CO2e
  if (input.sewage) {
    totalCO2e += input.sewage * WATER_SEWAGE_EMISSIONS.SEWAGE_KG_CO2E_PER_M3;
  }

  return totalCO2e;
}

// Paper & Waste
function calculatePaperAndWaste(input: {
  paperEcoLabeled?: number;
  paperStandard?: number;
  waste?: number;
}): number {
  let totalCO2e = 0;

  // Paper (Eco-labeled): (kg / 1000) * emission factor = kg CO2e
  if (input.paperEcoLabeled) {
    totalCO2e +=
      (input.paperEcoLabeled / 1000) *
      PAPER_WASTE_EMISSIONS.PAPER_ECO_LABELED_KG_CO2E_PER_TONNE;
  }

  // Paper (Standard): (kg / 1000) * emission factor = kg CO2e
  if (input.paperStandard) {
    totalCO2e +=
      (input.paperStandard / 1000) *
      PAPER_WASTE_EMISSIONS.PAPER_STANDARD_KG_CO2E_PER_TONNE;
  }

  // Waste (Paper/Electronics/Toners): (kg / 1000) * emission factor = kg CO2e
  if (input.waste) {
    totalCO2e += (input.waste / 1000) * PAPER_WASTE_EMISSIONS.WASTE_KG_CO2E_PER_TONNE;
  }

  return totalCO2e;
}

// Business Travel - Air
function calculateAirTravel(airTravelItems?: AirTravelItem[]): number {
  if (!airTravelItems || airTravelItems.length === 0) return 0;

  let totalCO2e = 0;

  for (const item of airTravelItems) {
    if (!item.distance || item.distance <= 0) continue;

    const distance = item.distance;
    let emissions;
    const miles = distance * DISTANCE_CONVERSION.KM_TO_MILES;

    // Categorize by distance and apply appropriate emission factors
    if (distance < AIR_TRAVEL_THRESHOLDS.SHORT_HAUL_MAX_KM) {
      // Short Haul (< 480 km)
      const co2 = miles * AIR_TRAVEL_EMISSIONS.SHORT_HAUL.CO2_KG_PER_MILE;
      const ch4 = (miles * AIR_TRAVEL_EMISSIONS.SHORT_HAUL.CH4_G_PER_MILE) / 1000; // Convert g to kg
      const n2o = (miles * AIR_TRAVEL_EMISSIONS.SHORT_HAUL.N2O_G_PER_MILE) / 1000; // Convert g to kg
      emissions = calculateCO2e(co2, ch4, n2o);
    } else if (distance < AIR_TRAVEL_THRESHOLDS.LONG_HAUL_MIN_KM) {
      // Medium Haul (480 - 3680 km)
      const co2 = miles * AIR_TRAVEL_EMISSIONS.MEDIUM_HAUL.CO2_KG_PER_MILE;
      const ch4 = (miles * AIR_TRAVEL_EMISSIONS.MEDIUM_HAUL.CH4_G_PER_MILE) / 1000; // Convert g to kg
      const n2o = (miles * AIR_TRAVEL_EMISSIONS.MEDIUM_HAUL.N2O_G_PER_MILE) / 1000; // Convert g to kg
      emissions = calculateCO2e(co2, ch4, n2o);
    } else {
      // Long Haul (>= 3680 km)
      const co2 = miles * AIR_TRAVEL_EMISSIONS.LONG_HAUL.CO2_KG_PER_MILE;
      const ch4 = (miles * AIR_TRAVEL_EMISSIONS.LONG_HAUL.CH4_G_PER_MILE) / 1000; // Convert g to kg
      const n2o = (miles * AIR_TRAVEL_EMISSIONS.LONG_HAUL.N2O_G_PER_MILE) / 1000; // Convert g to kg
      emissions = calculateCO2e(co2, ch4, n2o);
    }

    totalCO2e += emissions;
  }

  return totalCO2e;
}

// Business Travel - Train
function calculateTrainTravel(trainTravelItems?: TrainTravelItem[]): number {
  if (!trainTravelItems || trainTravelItems.length === 0) return 0;

  let totalCO2e = 0;

  for (const item of trainTravelItems) {
    if (!item.distance || item.distance <= 0) continue;

    const distance = item.distance;
    
    // Distance in km
    const co2 = distance * TRAIN_TRAVEL_EMISSIONS.CO2_KG_PER_KM;
    const miles = distance * DISTANCE_CONVERSION.KM_TO_MILES;
    const ch4 = miles * TRAIN_TRAVEL_EMISSIONS.CH4_KG_PER_MILE;
    const n2o = miles * TRAIN_TRAVEL_EMISSIONS.N2O_KG_PER_MILE;

    totalCO2e += calculateCO2e(co2, ch4, n2o);
  }

  return totalCO2e;
}

// Total Scope 3
function calculateScope3(input: Scope3Input): number {
  const waterAndSewage = calculateWaterAndSewage({
    water: input.water,
    sewage: input.sewage,
  });

  const paperAndWaste = calculatePaperAndWaste({
    paperEcoLabeled: input.paperEcoLabeled,
    paperStandard: input.paperStandard,
    waste: input.waste,
  });

  const airTravel = calculateAirTravel(input.airTravel);

  const trainTravel = calculateTrainTravel(input.trainTravel);

  return waterAndSewage + paperAndWaste + airTravel + trainTravel;
}

// Scope 3 with breakdown
export function calculateScope3WithBreakdown(input: Scope3Input): {
  total: number;
  breakdown: {
    waterAndSewage: number;
    paperAndWaste: number;
    airTravel: number;
    trainTravel: number;
  };
} {
  const waterAndSewage = calculateWaterAndSewage({
    water: input.water,
    sewage: input.sewage,
  });

  const paperAndWaste = calculatePaperAndWaste({
    paperEcoLabeled: input.paperEcoLabeled,
    paperStandard: input.paperStandard,
    waste: input.waste,
  });

  const airTravel = calculateAirTravel(input.airTravel);

  const trainTravel = calculateTrainTravel(input.trainTravel);

  return {
    total: waterAndSewage + paperAndWaste + airTravel + trainTravel,
    breakdown: {
      waterAndSewage: Math.round(waterAndSewage * 100) / 100,
      paperAndWaste: Math.round(paperAndWaste * 100) / 100,
      airTravel: Math.round(airTravel * 100) / 100,
      trainTravel: Math.round(trainTravel * 100) / 100,
    },
  };
}
