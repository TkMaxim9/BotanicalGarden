const express = require('express');
const path = require("path");
const session = require('express-session');
const bodyParser = require('body-parser')
const plantsRoutes = require('./routes/PlantsRoutes');
const GardenSectionRoutes = require('./routes/GardenSectionsRoutes');
const plantsSectionsRoutes = require('./routes/PlantSectionsRoutes');
const authRoutes = require('./routes/AuthRoutes');

const app = express();
const port = 3000;

app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Установите secure: true, если используете HTTPS
}));

app.use(bodyParser.json());

app.use(
  express.static(
    path.join(__dirname, 'Front')
  )
)

app.use('/api/plants', plantsRoutes);
app.use('/api/sections', GardenSectionRoutes);
app.use('/api/plantsections', plantsSectionsRoutes);
app.use('/api/auth', authRoutes);


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})