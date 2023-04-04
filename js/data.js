async function loadAddresses() {
    const response = await fetch('adresses.json');
    const data = await response.json();
    return data;
  }

  async function addAddress(address) {
    const response = await fetch('adresses.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(address)
    });
    const data = await response.json();
    return data;
  }

  