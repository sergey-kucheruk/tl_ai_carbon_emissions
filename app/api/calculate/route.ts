import { NextRequest, NextResponse } from 'next/server';
import { calculateCarbonFootprint } from '@/lib/backend/calculations';
import type { CarbonFootprintInput } from '@/lib/models/calculation';

export async function POST(request: NextRequest) {
  try {
    const body: CarbonFootprintInput = await request.json();

    // Validate input structure
    if (!body || (typeof body !== 'object')) {
      return NextResponse.json(
        { error: 'Invalid input format' },
        { status: 400 }
      );
    }

    // Calculate carbon footprint
    const result = calculateCarbonFootprint(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate carbon footprint' },
      { status: 500 }
    );
  }
}
