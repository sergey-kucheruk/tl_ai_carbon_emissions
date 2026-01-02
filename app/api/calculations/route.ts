import { NextRequest, NextResponse } from 'next/server';
import { getCalculationsRepository } from '@/lib/backend/repositories';
import type { CarbonFootprintInput, CarbonFootprintOutput } from '@/lib/models/calculation';
import { requireAuth } from '@/lib/backend/auth/middleware';

export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { userId } = authResult;

    const body = await request.json();
    const { name, input_data, result_data } = body;

    if (!name || !input_data || !result_data) {
      return NextResponse.json(
        { error: 'name, input_data, and result_data are required' },
        { status: 400 }
      );
    }

    const calculationsRepository = getCalculationsRepository();
    const calculation = await calculationsRepository.saveCalculation(
      userId,
      name,
      input_data as CarbonFootprintInput,
      result_data as CarbonFootprintOutput
    );

    return NextResponse.json({ calculation }, { status: 201 });
  } catch (error) {
    console.error('Save calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to save calculation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { userId } = authResult;

    const calculationsRepository = getCalculationsRepository();
    const calculations = await calculationsRepository.getCalculationsByUserId(userId);
    return NextResponse.json({ calculations });
  } catch (error) {
    console.error('Get calculations error:', error);
    return NextResponse.json(
      { error: 'Failed to get calculations' },
      { status: 500 }
    );
  }
}
