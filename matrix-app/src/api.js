
export async function getToken(url, username, password) {
    const response = await fetch(`${url}/matrix/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to get token from API: ', url);
    }
  
    const data = await response.json();
    return data.token;
  }