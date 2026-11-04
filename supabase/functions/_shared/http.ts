const localOrigins = new Set([
  'http://127.0.0.1:5173',
  'http://localhost:5173',
]);

function configuredOrigins() {
  return new Set(
    (Deno.env.get('CHECKOUT_ALLOWED_ORIGINS') ?? '')
      .split(',')
      .map((origin) => origin.trim().replace(/\/$/, ''))
      .filter(Boolean),
  );
}

export function requestOrigin(request: Request) {
  return (request.headers.get('origin') ?? '').replace(/\/$/, '');
}

export function isAllowedOrigin(request: Request) {
  const origin = requestOrigin(request);
  return Boolean(
    origin && (localOrigins.has(origin) || configuredOrigins().has(origin)),
  );
}

export function corsHeaders(request: Request) {
  const origin = requestOrigin(request);
  return {
    ...(isAllowedOrigin(request)
      ? { 'Access-Control-Allow-Origin': origin }
      : {}),
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
}

export function json(request: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), 'Content-Type': 'application/json' },
  });
}

export function publicError(reason: unknown) {
  console.error(reason);
  return 'Checkout is temporarily unavailable. Please try again.';
}
