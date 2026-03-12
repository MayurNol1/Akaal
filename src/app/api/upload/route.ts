import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  const session = await auth();

  // Basic security: Only admins can upload images
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const extension = file.name.split(".").pop();
    const filename = `${randomUUID()}.${extension}`;
    const relativePath = `/uploads/${filename}`;
    const absolutePath = join(process.cwd(), "public", "uploads", filename);

    await writeFile(absolutePath, buffer);

    return NextResponse.json({ url: relativePath });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
