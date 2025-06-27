function getApiBaseUrl() {
  const { protocol, hostname } = window.location;
  // localhost for dev
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//172.16.55.152:8080`;
  }
  // Use current host
  return `${protocol}//${hostname}:8080`;
}

function getWsBaseUrl() {
  const { hostname } = window.location;
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${wsProtocol}//172.16.55.152:8080`;
  }
  return `${wsProtocol}//${hostname}:8080`;
}

export const API_BASE_URL = getApiBaseUrl();
export const WS_BASE_URL = getWsBaseUrl();
