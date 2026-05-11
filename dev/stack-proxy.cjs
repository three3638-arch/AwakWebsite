/**
 * Single-entry dev proxy: http://127.0.0.1:8080
 * - Mirrors nginx/dev UA redirect + /m prefix routing
 * - Supports Vite HMR WebSockets (no Docker required)
 *
 * Env: STACK_PROXY_PORT (default 8080), STACK_PC_PORT (3003), STACK_MOBILE_PORT (3004)
 */
'use strict';

const http = require('http');
const httpProxy = require('http-proxy');

const PC_PORT = Number(process.env.STACK_PC_PORT || 3003);
const MOBILE_PORT = Number(process.env.STACK_MOBILE_PORT || 3004);
const LISTEN_PORT = Number(process.env.STACK_PROXY_PORT || 8080);

const proxy = httpProxy.createProxyServer({
  ws: true,
  xfwd: true,
});

proxy.on('error', (err, req, res) => {
  console.error('[stack-proxy]', err.message);
  if (res && typeof res.writeHead === 'function' && !res.headersSent) {
    res.writeHead(502, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end(
      `Bad Gateway (${err.code || err.message}). Start PC :${PC_PORT} and mobile :${MOBILE_PORT} first.`,
    );
  }
});

function isMobileUA(ua) {
  if (!ua) return false;
  if (/ipad/i.test(ua)) return false;
  if (/tablet/i.test(ua)) return false;
  return /android.*(mobile|phone)|iphone|ipod|blackberry|bb10|iemobile|windows\s+phone|opera\s+mini|webos/i.test(
    ua,
  );
}

function shouldRedirectToMobile(req) {
  const cookie = req.headers.cookie || '';
  if (/prefer_desktop=1/.test(cookie)) return false;
  const url = req.url || '';
  if (url.startsWith('/m')) return false;
  return isMobileUA(req.headers['user-agent'] || '');
}

function targetFor(url) {
  return (url || '').startsWith('/m')
    ? `http://127.0.0.1:${MOBILE_PORT}`
    : `http://127.0.0.1:${PC_PORT}`;
}

const server = http.createServer((req, res) => {
  if (shouldRedirectToMobile(req)) {
    res.writeHead(302, {Location: `/m${req.url}`});
    res.end();
    return;
  }
  proxy.web(req, res, {target: targetFor(req.url)});
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head, {target: targetFor(req.url)});
});

server.listen(LISTEN_PORT, '0.0.0.0', () => {
  console.log(
    `[stack-proxy] http://127.0.0.1:${LISTEN_PORT}/  → PC :${PC_PORT}, /m → mobile :${MOBILE_PORT}`,
  );
});
