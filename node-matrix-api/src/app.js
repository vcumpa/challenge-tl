const express = require('express');
const cors = require('cors');
const jwt = require('jwt-simple');
const dotenv = require('dotenv');
const middleware = require('./jwt');
const moment = require('moment');

dotenv.config();

const app = express();
const secret = 'mi_password';

app.use(cors());
app.use(express.json());

app.post('/api/matrix/token', (req, res) => {
  const { username, password } = req.body;

  // Verifica las credenciales de usuario
  if (username === 'node_api' && password === 'node_password') {
    const payload = {
      sub: username,
      iat: moment().unix(),
      exp: moment().add(14, 'days').unix(),
    };
    const token = jwt.encode(payload, secret);
    
    console.log("Generated Node Token:", token);

    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.use(middleware.ensureAuth);

const matrixRoutes = require('./routes/matrix.routes');
app.use('/api/matrix', matrixRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;