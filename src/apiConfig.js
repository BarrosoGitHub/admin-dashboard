function getApiBaseUrl() {
  const { protocol, hostname, port } = window.location;
  // localhost for dev mode - direct backend connection
  // if (hostname === 'localhost' || hostname === '127.0.0.1') {
  //   return `${protocol}//localhost:5087`;
  // }
  // Production mode - use nginx reverse proxy with port from current URL
  const portPart = port ? `:${port}` : '';
  return `${protocol}//${hostname}${portPart}/api`;
}

function getWsBaseUrl() {
  const { hostname, port } = window.location;
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  // localhost for dev mode - direct backend connection
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${wsProtocol}//172.16.55.149:8080`;
  }
  // Production mode - use nginx reverse proxy with port from current URL
  const portPart = port ? `:${port}` : '';
  return `${wsProtocol}//${hostname}${portPart}/api`;
}

export const API_BASE_URL = getApiBaseUrl();
export const WS_BASE_URL = getWsBaseUrl();

export { getApiBaseUrl, getWsBaseUrl };
