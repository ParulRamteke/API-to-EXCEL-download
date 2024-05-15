const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();


app.use(express.static('public'));


app.get('/download', (req, res) => {
    const filePath = path.join(__dirname, 'ledger_data.xlsx');

  
    if (fs.existsSync(filePath)) {
        
        res.setHeader('Content-disposition', 'attachment; filename=ledger_data.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } else {
        
        res.status(404).send('File not found.');
    }
});


app.get('/', (req, res) => {
    res.redirect('/download');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

