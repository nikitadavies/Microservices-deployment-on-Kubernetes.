const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 6000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Container 1 up');
});

app.post('/store-file', async (req, res) => {
    const { file, data } = req.body;
    if (!file || !data) {
        return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
    }

    const filePath = path.join('/nikita_PV_dir', file);
    try {
        fs.writeFileSync(filePath, data);
        res.json({ file, message: 'Success.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ file, error: 'Error while storing the file' });
    }
});

app.post('/calculate', async (req, res) => {
    try {
        const { file, product } = req.body;

        // Validation
        if (!file) {
            return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
        }

        // Mount the host machine directory '.' to a docker volume
        const filePath = path.join('/nikita_PV_dir', file);

        try {
            // Check if the file exists
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    // File not found
                    return res.status(404).json({ file, error: 'File not found.' });
                }

                axios.post('http://localhost:6001/calculate', { file, product })
                    .then(response => {
                        res.json(response.data);
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(400).json({ file, error: 'Input file not in CSV format.' });
                    });
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Container 1 listening on port ${PORT}`);
});
