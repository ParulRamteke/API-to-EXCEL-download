const axios = require('axios');
const XLSX = require('xlsx');
const fs = require('fs');

async function fetchDataFromAPI(apiURL) {
    try {
        const response = await axios.get(apiURL);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from the API:', error);
        return null;
    }
}


function exportToExcel(data, filename) {
   
    if (Array.isArray(data) && data.length > 0) {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        
        const excelData = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

       
        fs.writeFileSync(filename, excelData);
        console.log('Excel file generated successfully:', filename);
    } else {
        console.log('Data is empty or not in the correct format.');
    }
}


function extractLedgerData(apiResponse) {
    const ledgerData = [];
    apiResponse.forEach(obj => {
        const yearData = obj['2022']; 
        if (Array.isArray(yearData)) {
            yearData.forEach(item => {
                const ledger = item.LEDGER;
                if (Array.isArray(ledger)) {
                    ledgerData.push(...ledger);
                }
            });
        }
    });
    return ledgerData;
}


const apiURL = 'https://suprsales.in:5032/suprsales_api/Customer_Dashboard/viewLedgerMob.php?id=105709';


fetchDataFromAPI(apiURL)
    .then(data => {
        console.log('API Response:', data);
        if (data) {
            
            const ledgerData = extractLedgerData(data);
            console.log('Ledger Data:', ledgerData); 
            if (ledgerData.length > 0) {
                
                exportToExcel(ledgerData, 'ledger_data.xlsx');
            } else {
                console.log('No ledger data found for the year 2022.');
            }
        } else {
            console.log('No data fetched from the API.');
        }
    })
    .catch(error => {
        console.error('Error fetching data from the API:', error);
    });
