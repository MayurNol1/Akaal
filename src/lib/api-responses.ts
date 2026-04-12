import { NextResponse } from "next/server";

/** Standard success envelope: { success: true, data: T } */
export function successResponse(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 500, errors?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(errors && typeof errors === "object" ? { details: errors } : {}),
    },
    { status }
  );
}

export function unauthorizedResponse() {
  return errorResponse("Unauthorized. Admin access required.", 403);
}
