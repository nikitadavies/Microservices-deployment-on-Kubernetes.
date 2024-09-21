const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 6001;
// Persisitent volume
const dataPath = '/nikita_PV_dir';

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Container 2 up');
});

const isCorrectCSVFormat = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    if (lines.length === 0) return false;

    const header = lines[0].trim().split(',').map(h => h.trim());
    return header.length === 2 && header[0] === 'product' && header[1] === 'amount';
  } catch (error) {
    console.error(error);
    return false;
  }
};


app.post('/calculate', (req, res) => {
  try {
    const { file, product } = req.body;
    if (!file) {
      return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
    }

    const filePath = path.join(dataPath, file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ file, error: 'File not found.' });
    }
    if (!isCorrectCSVFormat(filePath)) {
      return res.status(400).json({ file, error: 'Input file not in CSV format.' });
    }

    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim(),
        mapValues: ({ value }) => value.trim()
      }))
      .on('data', (row) => rows.push(row))
      .on('end', () => {
        if (rows.length === 0) {
          return res.status(400).json({ file, error: 'Input file is empty.' });
        }

        const sum = rows.reduce((acc, row) => {
          if (row.product === product) {
            acc += parseInt(row.amount, 10) || 0;
          }
          return acc;
        }, 0);

        res.json({ file, sum });
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Container 2 listening on port ${PORT}`);
});
