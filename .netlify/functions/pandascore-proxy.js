// .netlify/functions/pandascore-proxy.js
exports.handler = async (event) => {
  const PANDASCORE_TOKEN = process.env.PANDASCORE_TOKEN;
  const API_BASE = 'https://api.pandascore.co';
  
  // Получаем путь и параметры из запроса
  const { httpMethod, queryStringParameters } = event;
  
  // Формируем URL к PandaScore API
  // Например: /tournaments или /tournaments/123/matches
  const path = event.path.replace('/.netlify/functions/pandascore-proxy', '');
  const params = new URLSearchParams(queryStringParameters || {});
  
  try {
    const url = `${API_BASE}${path}?${params.toString()}`;
    
    console.log('📡 Proxy request to:', url);
    
    const response = await fetch(url, {
      method: httpMethod || 'GET',
      headers: {
        'Authorization': `Bearer ${PANDASCORE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};