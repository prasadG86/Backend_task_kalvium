const express = require('express');
const fs = require('fs');
const app = express();

const historyFilePath = 'history.json';
let history = loadHistory();

const MAX_HISTORY_LENGTH = 20;

function loadHistory() {
    try {
        const data = fs.readFileSync(historyFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveHistory() {
    fs.writeFileSync(historyFilePath, JSON.stringify(history), 'utf8');
}

app.get('/', (req, res) => {
    res.send('Welcome to the Math API. Use /{expression} to perform operations.');
});

app.get('/history', (req, res) => {
    res.json(history);
});

app.get('/:expression', (req, res) => {
    const expression = req.params.expression.replace(/plus/g, '+').replace(/minus/g, '-').replace(/into/g, '*').replace(/over/g, '/');
    
    try {
        const answer = eval(expression);
        const operation = { question: expression, answer: answer };
        history.unshift(operation);
        if (history.length > MAX_HISTORY_LENGTH) {
            history.pop();
        }
        saveHistory();
        res.json(operation);
    } catch (error) {
        res.status(400).json({ error: "Invalid expression" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});










































