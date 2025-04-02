require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;

let numberWindow = [];
let windowPrevState = [];

const API_ENDPOINTS = {
  'p': 'http://20.244.56.144/evaluation-service/primes',
  'f': 'http://20.244.56.144/evaluation-service/fibo',
  'e': 'http://20.244.56.144/evaluation-service/even',
  'r': 'http://20.244.56.144/evaluation-service/rand'
};

const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjAzMDA4LCJpYXQiOjE3NDM2MDI3MDgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImZjOTNiYjMxLWQzODktNGM2Ni1hOTNkLTg3YjI4ZTY4MWY5NiIsInN1YiI6InNhdHlhbXN3YWluMjI3QGdtYWlsLmNvbSJ9LCJlbWFpbCI6InNhdHlhbXN3YWluMjI3QGdtYWlsLmNvbSIsIm5hbWUiOiJzYXR5YW0gc3ViaGFtIHN3YWluIiwicm9sbE5vIjoiMjIwNTM1NDMiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiJmYzkzYmIzMS1kMzg5LTRjNjYtYTkzZC04N2IyOGU2ODFmOTYiLCJjbGllbnRTZWNyZXQiOiJLWkpiTXdkbVRXQ1pKc2hnIn0.Y4GXu__Ts-JzNcYEKa6_dJI9CIHE2HNlj2VOFA_96xs";

app.use(express.json());

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;
  const endpoint = API_ENDPOINTS[numberid];

  if (!endpoint) {
    return res.status(400).json({ error: 'Invalid number type. Use p|f|e|r' });
  }

  try {
    const response = await axios.get(endpoint, { 
      timeout: 500,
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjAzMDA4LCJpYXQiOjE3NDM2MDI3MDgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImZjOTNiYjMxLWQzODktNGM2Ni1hOTNkLTg3YjI4ZTY4MWY5NiIsInN1YiI6InNhdHlhbXN3YWluMjI3QGdtYWlsLmNvbSJ9LCJlbWFpbCI6InNhdHlhbXN3YWluMjI3QGdtYWlsLmNvbSIsIm5hbWUiOiJzYXR5YW0gc3ViaGFtIHN3YWluIiwicm9sbE5vIjoiMjIwNTM1NDMiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiJmYzkzYmIzMS1kMzg5LTRjNjYtYTkzZC04N2IyOGU2ODFmOTYiLCJjbGllbnRTZWNyZXQiOiJLWkpiTXdkbVRXQ1pKc2hnIn0.Y4GXu__Ts-JzNcYEKa6_dJI9CIHE2HNlj2VOFA_96xs`
      }
    });
    
    const newNumbers = response.data.numbers;
    
    windowPrevState = [...numberWindow];
    
    newNumbers.forEach(num => {
      if (!numberWindow.includes(num)) {
        if (numberWindow.length >= WINDOW_SIZE) {
          numberWindow.shift(); 
        }
        numberWindow.push(num);
      }
    });

    const avg = numberWindow.length > 0 
      ? parseFloat((numberWindow.reduce((a, b) => a + b, 0) / numberWindow.length).toFixed(2))
      : 0;

    res.json({
      windowPrevState,
      windowCurrState: numberWindow,
      numbers: newNumbers,
      avg
    });
  } catch (error) {
    res.json({
      windowPrevState,
      windowCurrState: numberWindow,
      numbers: [],
      avg: numberWindow.length > 0 
        ? parseFloat((numberWindow.reduce((a, b) => a + b, 0) / numberWindow.length).toFixed(2))
        : 0
    });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
