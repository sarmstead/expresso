// Import Express
const express = require('express');
const app = express();

// Set PORT variable
const PORT = process.env.PORT || 4000;

// Start server 
app.listen(PORT, () => {
    console.log(`Server now listening on PORT: ${PORT} ...`);
});

// Export Express app
module.exports = app;