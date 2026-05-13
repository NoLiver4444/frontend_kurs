// Прокси для обхода CORS
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export async function fetchWithProxy(url, options = {}) {
  try {
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl, options);
    return response;
  } catch (error) {
    console.error('Ошибка прокси:', error);
    throw error;
  }
}