import getDb from '@/db/mockDB';

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development' && process.env['TESTING'] !== '1') {
    return new Response(null, { status: 404 });
  }

  getDb().seed(await request.json());
  return new Response();
}
