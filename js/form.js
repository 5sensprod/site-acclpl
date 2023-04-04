

const addAddressButton = document.getElementById('add-address-button');
const addAddressDialog = document.getElementById('add-address-dialog');
const cancelAddButton = document.getElementById('cancel-add-button');
const addAddressForm = addAddressDialog.querySelector('form');

addAddressButton.addEventListener('click', () => {
    addAddressDialog.style.display = 'block';
});

cancelAddButton.addEventListener('click', () => {
    addAddressDialog.style.display = 'none';
});

addAddressForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const street = addAddressForm.elements['street'].value;
    const city = addAddressForm.elements['city'].value;
    const postalCode = addAddressForm.elements['postal-code'].value;
    
    const address = {
        street: street,
        city: city,
        postalCode: postalCode,
    };
    
    console.log('Form submitted');
    console.log('Street:', street);
    console.log('City:', city);
    console.log('Postal Code:', postalCode);
    
    // Ajouter l'adresse à la liste des adresses
    await saveAddress(address);
    console.log('Address saved:', address);
    
    // Fermer la boîte de dialogue
    addAddressDialog.style.display = 'none';
    
    // Mettre à jour la liste des adresses
    const addresses = await loadAddresses();
    console.log('Addresses:', addresses);
    updateAutocompleteList(searchInput, addresses, map);
});

async function saveAddress(address) {
    const addresses = await loadAddresses();
    addresses.push(address);
    const response = await fetch('js/adresses.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(addresses)
    });
    const data = await response.json();
    return data;
}
  async function loadAddresses() {
    const response = await fetch('js/adresses.json');
    const data = await response.json();
    return data;
  }