function getApiBaseUrl() {
  const { protocol, hostname } = window.location;
  // localhost for dev mode - direct backend connection
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//172.16.55.149:8080`;
  }
  // Production mode - use nginx reverse proxy (no port, /api prefix)
  return `${protocol}//${hostname}/api`;
}

function getWsBaseUrl() {
  const { hostname } = window.location;
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  // localhost for dev mode - direct backend connection
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${wsProtocol}//172.16.55.149:8080`;
  }
  // Production mode - use nginx reverse proxy (no port, /api prefix for WebSocket)
  return `${wsProtocol}//${hostname}/api`;
}

export const API_BASE_URL = getApiBaseUrl();
export const WS_BASE_URL = getWsBaseUrl();
