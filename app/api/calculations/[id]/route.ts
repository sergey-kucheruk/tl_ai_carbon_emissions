import { NextRequest, NextResponse } from "next/server";
import { getCalculationsRepository } from "@/lib/backend/repositories";
import { requireAuth } from "@/lib/backend/auth/middleware";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { userId } = authResult;
    const { id: idString } = await params;
    const id = parseInt(idString);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid calculation ID" },
        { status: 400 }
      );
    }

    const calculationsRepository = getCalculationsRepository();
    const calculation = await calculationsRepository.getCalculationById(
      id,
      userId
    );

    if (!calculation) {
      return NextResponse.json(
        { error: "Calculation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ calculation });
  } catch (error) {
    console.error("Get calculation error:", error);
    return NextResponse.json(
      { error: "Failed to get calculation" },
      { status: 500 }
    );
  }
}
