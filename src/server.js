const express = require('express');
const app = express();
const env = require('dotenv');
const mongoose = require('mongoose');
const path = require("path");
const cors = require('cors');


//percorsi
const userRoutes = require('./Routes/utente');
const adminRoutes = require('./Routes/admin/admin');
const categorieRoutes = require('./Routes/Categorie');
const partitaRoutes = require('./Routes/Partita');
const stadioRoutes = require('./Routes/Stadio');
const carrelloRoutes = require('./Routes/Carrello');
const initialDataRoutes = require('./Routes/admin/initialData');
const ordineRoutes = require('./Routes/Ordine');




env.config();

app.use(cors());
app.use(express.json());
app.use('/api/public', express.static(path.join(__dirname, 'uploads')));
app.use('/api', userRoutes);
app.use('/api', adminRoutes);
app.use('/api', categorieRoutes);
app.use('/api', partitaRoutes);
app.use('/api', stadioRoutes);
app.use('/api', carrelloRoutes);
app.use('/api', initialDataRoutes);
app.use('/api', ordineRoutes);



// mongodb connection string
mongoose.connect(
    `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.fbrkf.mongodb.net/${process.env.DB_Database}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    console.log('Database Conesso');
});

app.listen(process.env.PORT, () => {
    console.log(`Server in ascolto sull porta ${process.env.PORT}`);
});

