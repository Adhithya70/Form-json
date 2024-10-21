const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Set up Handlebars as the template engine
const { engine } = require('express-handlebars');
app.engine('handlebars', engine());

app.set('view engine', 'handlebars');

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, etc.)
app.use(express.static('public'));

// Route to display the form
app.get('/', (req, res) => {
    res.render('form');
});

// Route to handle form submission and store data in JSON file
app.post('/submit', (req, res) => {
    const formData = req.body;

    // Write the form data to a JSON file
    const filePath = path.join(__dirname, 'data', 'formData.json');
    
    // Check if file exists, append data, else create new file with initial data
    fs.readFile(filePath, 'utf8', (err, data) => {
        let jsonData = [];
        
        if (!err && data) {
            jsonData = JSON.parse(data);  // If data exists, parse it
        }

        jsonData.push(formData);  // Add new form data

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing JSON file:', err);
                res.status(500).send('Error saving form data');
            } else {
                res.redirect('/display');
            }
        });
    });
});

// Route to display stored form data
app.get('/display', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'formData.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading form data');
        } else {
            const formData = JSON.parse(data || '[]');
            res.render('display', { formData });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
