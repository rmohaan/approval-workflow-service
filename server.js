const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const workflowRoutes = require('./routes/workflowRoutes');
const dotenv = require('dotenv');

const app = express();

dotenv.config();
app.use(express.json());

console.log(process.env.DB_PASSWORD)
// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/workflow', workflowRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Approval Workflow System');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
