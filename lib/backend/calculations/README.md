# Carbon Footprint Calculation Logic

This module contains the calculation logic for the Carbon Footprint Calculator, following standard GHG Protocol methodologies.

## Structure

- `constants.ts` - Conversion factors and emission factors (energy conversion, emissions per GJ, refrigerant GWP)
- `co2e.ts` - Global CO2e formula
- `scope1.ts` - Direct emissions (Energy Carriers, Fleet, Refrigerants)
- `scope2.ts` - Indirect emissions (Electricity, District Heating)
- `scope3.ts` - Other indirect emissions (Water, Paper, Travel)
- `index.ts` - Main calculation function

## Usage

### API Endpoint

**POST** `/api/calculate`

### Request Body Example

```json
{
  "scope1": {
    "energyCarriers": {
      "naturalGas": 100,    // m³
      "heatingOil": 50,     // liters
      "coal": 2             // tonnes
    },
    "fleet": {
      "gasoline": 200,      // liters
      "diesel": 150,        // liters (fleet vehicles)
      "dieselGenerators": 50 // liters (generators)
    },
    "refrigerants": {
      "r407c": 5,           // kg
      "r32": 3,             // kg
      "r410a": 2            // kg
    }
  },
  "scope2": {
    "electricity": 5000,    // kWh
    "districtHeating": 100  // GJ
  },
  "scope3": {
    "water": 50,            // m³
    "sewage": 50,           // m³
    "paperEcoLabeled": 100, // kg
    "paperStandard": 200,   // kg
    "waste": 500,           // kg
    "airTravel": [
      {
        "name": "Flight 1",  // Flight route/description (optional)
        "distance": 400      // km - automatically categorized as short/medium/long haul
      },
      {
        "name": "Flight 2",
        "distance": 2000     // km - automatically categorized
      },
      {
        "name": "Flight 3",
        "distance": 5000     // km - automatically categorized
      }
    ],
    "trainTravel": [
      {
        "name": "Route 1",   // Train route/description (optional)
        "distance": 500      // km
      },
      {
        "name": "Route 2",
        "distance": 300      // km
      }
    ]
  }
}
```

### Response Example

```json
{
  "scope1Total": 12345.67,
  "scope2Total": 4567.89,
  "scope3Total": 2345.12,
  "totalFootprint": 19258.68
}
```

All values are in **kg CO2e** (Kilograms of CO2 Equivalent), rounded to 2 decimal places.

## Calculation Details

### Global CO2e Formula

For any emission source where Methane (CH₄) or Nitrous Oxide (N₂O) are involved:

```
CO2e = CO2 + (CH4 × 28) + (N2O × 265)
```

Where:
- CO₂ is in kg
- CH₄ is in kg (converted from grams where necessary)
- N₂O is in kg (converted from grams where necessary)
- 28 = Global Warming Potential (GWP) of CH₄
- 265 = Global Warming Potential (GWP) of N₂O

### Scope 1: Direct Emissions

#### Energy Carriers

**Natural Gas (m³)**
1. Convert to Energy: `m³ × 0.039492 = GJ`
2. Calculate Emissions (per GJ):
   - CO₂: `GJ × 57.65 = kg CO₂`
   - CH₄: `GJ × 0.0009479 = kg CH₄`
   - N₂O: `GJ × 0.0000948 = kg N₂O`
3. Apply Global CO₂e formula

**Heating Oil (liters)**
1. Convert to Energy: `liters × 0.0344 = GJ`
2. Calculate Emissions (per GJ):
   - CO₂: `GJ × 74.10 = kg CO₂`
   - CH₄: `GJ × 0.0028 = kg CH₄`
   - N₂O: `GJ × 0.0006 = kg N₂O`
3. Apply Global CO₂e formula

**Coal (tonnes)**
1. Convert to Energy: `tonnes × 22.55 = GJ`
2. Calculate Emissions (per GJ):
   - CO₂: `GJ × 94.78 = kg CO₂`
   - CH₄: `GJ × 0.0104 = kg CH₄`
   - N₂O: `GJ × 0.0015 = kg N₂O`
3. Apply Global CO₂e formula

#### Fleet & Generators

**Gasoline (liters)**
1. Convert to Energy: `liters × 0.0319 = GJ`
2. Calculate Emissions (per GJ):
   - CO₂: `GJ × 69.30 = kg CO₂`
   - CH₄: `GJ × 0.0028 = kg CH₄`
   - N₂O: `GJ × 0.0006 = kg N₂O`
3. Apply Global CO₂e formula

**Diesel - Fleet Vehicles (liters)**
1. Convert to Energy: `liters × 0.0353 = GJ`
2. Calculate Emissions (per GJ):
   - CO₂: `GJ × 74.10 = kg CO₂`
   - CH₄: `GJ × 0.0028 = kg CH₄`
   - N₂O: `GJ × 0.0006 = kg N₂O`
3. Apply Global CO₂e formula

**Diesel - Generators (liters)**
1. Convert to Energy: `liters × 0.0353 = GJ`
2. Calculate Emissions (per GJ):
   - CO₂: `GJ × 74.10 = kg CO₂`
   - CH₄: `GJ × 0.0028 = kg CH₄`
   - N₂O: `GJ × 0.0006 = kg N₂O`
3. Apply Global CO₂e formula

#### Refrigerants

Refrigerants use direct Global Warming Potential (GWP) factors:

- **R407C**: `kg × 1624 = kg CO₂e`
- **R32**: `kg × 677 = kg CO₂e`
- **R410A**: `kg × 1924 = kg CO₂e`

### Scope 2: Indirect Emissions (Purchased Energy)

**Electricity (kWh)**
1. Convert to MWh: `kWh ÷ 1000 = MWh`
2. Calculate: `MWh × 698 = kg CO₂e`
   - Note: Only CO₂ is counted for this region

**District Heating (GJ)**
1. Calculate: `GJ × 95.05 = kg CO₂e`
   - Note: Only CO₂ is counted for this region

### Scope 3: Other Indirect Emissions

**Water & Sewage**
- **Water**: `m³ × 0.149 = kg CO₂e`
- **Sewage**: `m³ × 0.272 = kg CO₂e`

**Paper & Waste**
- **Paper (Eco-labeled)**: `(kg ÷ 1000) × 739.4 = kg CO₂e`
- **Paper (Standard)**: `(kg ÷ 1000) × 919.4 = kg CO₂e`
- **Waste** (Paper/Electronics/Toners): `(kg ÷ 1000) × 21.29 = kg CO₂e`

**Business Travel - Air**

Air travel is provided as an array of flight items, each with a name (optional) and distance in kilometers. The system automatically categorizes each flight into short, medium, or long haul based on distance, then applies the appropriate emission factors. Distance is converted to miles for calculation (1 km = 0.6214 miles):

**Distance Categories:**
- **Short Haul**: < 480 km
- **Medium Haul**: 480 - 3680 km
- **Long Haul**: >= 3680 km

**Short Haul (< 480 km)**
1. Convert to miles: `km × 0.6214 = miles`
2. Calculate Emissions:
   - CO₂: `miles × 0.215 = kg CO₂`
   - CH₄: `miles × 0.0077 g = kg CH₄` (converted to kg)
   - N₂O: `miles × 0.0068 g = kg N₂O` (converted to kg)
3. Apply Global CO₂e formula

**Medium Haul (480 - 3680 km)**
1. Convert to miles: `km × 0.6214 = miles`
2. Calculate Emissions:
   - CO₂: `miles × 0.133 = kg CO₂`
   - CH₄: `miles × 0.0006 g = kg CH₄` (converted to kg)
   - N₂O: `miles × 0.0042 g = kg N₂O` (converted to kg)
3. Apply Global CO₂e formula

**Long Haul (>= 3680 km)**
1. Convert to miles: `km × 0.6214 = miles`
2. Calculate Emissions:
   - CO₂: `miles × 0.165 = kg CO₂`
   - CH₄: `miles × 0.0006 g = kg CH₄` (converted to kg)
   - N₂O: `miles × 0.0052 g = kg N₂O` (converted to kg)
3. Apply Global CO₂e formula

**Business Travel - Train**

Train travel is provided as an array of route items, each with a name (optional) and distance in kilometers. Each route's emissions are calculated and summed:

For each route:
- CO₂: `km × 0.028 = kg CO₂`
- CH₄: `km × 0.0000057 = kg CH₄`
- N₂O: `km × 0.0000016 = kg N₂O`
- Apply Global CO₂e formula

## Constants

All conversion factors and emission factors are defined in `constants.ts` for maintainability:

- **Energy Conversion Factors**: Convert input units to GJ
- **Emission Factors**: CO₂, CH₄, and N₂O emissions per GJ for each fuel type
- **Refrigerant GWP**: Global Warming Potential factors for refrigerants

This centralized approach makes it easy to update factors when methodologies change.

## Notes

- All input values must be >= 0 (negative values are not allowed)
- Empty or zero values are treated as 0 and do not contribute to emissions
- Results are rounded to 2 decimal places
- The calculation follows GHG Protocol standards for corporate carbon accounting
