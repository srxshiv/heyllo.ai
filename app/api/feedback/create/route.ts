import { createFeedBack } from "@/lib/actions/general.action";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { interviewId, userId, transcript } = await request.json();

    if (!interviewId || !userId || !transcript) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await createFeedBack({
      interviewId,
      userId,
      transcript,
    });

    if (result.success) {
      return NextResponse.json(
        { success: true, feedbackId: result.id },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to create feedback" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in feedback creation API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
} 