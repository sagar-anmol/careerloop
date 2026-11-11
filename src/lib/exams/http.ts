import type { ApiError } from "./attempts";

export function jsonError(error: ApiError): Response {
  return Response.json({ error: error.message, code: error.code }, { status: error.status });
}

export function jsonServerError(error: unknown): Response {
  console.error("Exam API error:", error);
  return Response.json(
    { error: "Something went wrong on the server. Try again.", code: "INTERNAL" },
    { status: 500 }
  );
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return typeof body === "object" && body !== null && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export function errorOf(status: number, code: string, message: string): ApiError {
  return { status, code, message };
}
