export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({ alive: true, ts: Date.now(), v: 'SESSION-V1' });
}
