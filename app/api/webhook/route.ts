export const dynamic = 'force-dynamic';
export async function GET() {
  return new Response("Webhook Path Found!");
}
export async function POST() {
  return new Response("OK");
}