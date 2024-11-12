import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', () => {
    const addTaxPayerForm = document.getElementById('addTaxPayerForm');
    const searchTaxPayerForm = document.getElementById('searchTaxPayerForm');
    const taxPayerList = document.getElementById('taxPayerList');
    const searchResult = document.getElementById('searchResult');
    const loadingSpinner = document.getElementById('loadingSpinner');

    addTaxPayerForm.addEventListener('submit', addTaxPayer);
    searchTaxPayerForm.addEventListener('submit', searchTaxPayer);

    loadTaxPayers();

    async function addTaxPayer(e) {
        e.preventDefault();
        showSpinner();

        const tid = document.getElementById('tid').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const address = document.getElementById('address').value;

        try {
            await backend.addTaxPayer(tid, firstName, lastName, address);
            addTaxPayerForm.reset();
            loadTaxPayers();
        } catch (error) {
            console.error('Error adding TaxPayer:', error);
        }

        hideSpinner();
    }

    async function searchTaxPayer(e) {
        e.preventDefault();
        showSpinner();

        const searchTid = document.getElementById('searchTid').value;

        try {
            const result = await backend.getTaxPayer(searchTid);
            if (result.length > 0) {
                const taxPayer = result[0];
                searchResult.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${taxPayer.firstName} ${taxPayer.lastName}</h5>
                            <p class="card-text">TID: ${taxPayer.tid}</p>
                            <p class="card-text">Address: ${taxPayer.address}</p>
                        </div>
                    </div>
                `;
            } else {
                searchResult.innerHTML = '<p>No TaxPayer found with the given TID.</p>';
            }
        } catch (error) {
            console.error('Error searching for TaxPayer:', error);
            searchResult.innerHTML = '<p>Error searching for TaxPayer. Please try again.</p>';
        }

        hideSpinner();
    }

    async function loadTaxPayers() {
        showSpinner();

        try {
            const taxPayers = await backend.getAllTaxPayers();
            taxPayerList.innerHTML = taxPayers.map(taxPayer => `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${taxPayer.firstName} ${taxPayer.lastName}</h5>
                        <p class="card-text">TID: ${taxPayer.tid}</p>
                        <p class="card-text">Address: ${taxPayer.address}</p>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading TaxPayers:', error);
            taxPayerList.innerHTML = '<p>Error loading TaxPayers. Please try again.</p>';
        }

        hideSpinner();
    }

    function showSpinner() {
        loadingSpinner.style.display = 'block';
    }

    function hideSpinner() {
        loadingSpinner.style.display = 'none';
    }
});
