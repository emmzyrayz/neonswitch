export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    runtime: "nodejs",
    nodeVersion: process.version,
    hasMongoURI: Boolean(process.env.MONGODB_URI),
  });
}
