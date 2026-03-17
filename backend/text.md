## Backend
- This is definitively an API endpoint or API route:

    ```javascript
    app.post('/api/shorten', (req, res) => {
    // ... code to shorten the url
    })
    ```

## Frontend
- When you used `fetch('http://localhost:3000/api/shorten')` in your React frontend, you were making an API Call to the specific API Endpoint hosted by your API Server.

