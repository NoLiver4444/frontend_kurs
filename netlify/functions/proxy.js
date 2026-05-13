exports.handler = async (event) => {
  const { path, queryStringParameters, headers } = event;
  
  try {
    const response = await fetch(`https://api.pandascore.co${path}?${new URLSearchParams(queryStringParameters)}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PANDASCORE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};