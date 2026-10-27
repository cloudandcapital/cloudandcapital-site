const retired = () => new Response(JSON.stringify({
  error: 'This tool is no longer available.',
  tools: '/tools',
}), {
  status: 410,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
});

export const GET = retired;
export const POST = retired;
