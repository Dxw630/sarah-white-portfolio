const express = require('express');
const { engine } = require('express-handlebars');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const dbPath = path.join(__dirname, 'sqlite', 'portfolio.db');
const db = new sqlite3.Database(dbPath);

// Setup Handlebars with helpers
app.engine('handlebars', engine({
  helpers: {
    encodeURIComponent: function (str) {
      return encodeURIComponent(str);
    },
    getColorClass: function (name) {
      switch (name.toLowerCase()) {
        case 'blue': return 'btn-primary';
        case 'red': return 'btn-danger';
        case 'yellow': return 'btn-warning';
        case 'green': return 'btn-success';
        case 'purple': return 'btn-info';
        case 'rainbow': return 'btn-rainbow';
        default: return 'btn-secondary';
      }
    },
    splitTitle: function (title) {
      return title.split(' ');
    }
  }
}));
app.set('view engine', 'handlebars');

// Home Page
app.get('/', async (req, res) => {
  try {
    const categories = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM categories', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const projects = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM projects', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.render('home', { categories, projects, pageTitle: "Recent Projects" });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading home page.');
  }
});

// Category Pages
app.get('/category/:id', async (req, res) => {
  const categoryId = req.params.id;
  try {
    const categories = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM categories', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const selectedCategory = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM categories WHERE id = ?', [categoryId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const projects = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM projects WHERE category_id = ?', [categoryId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.render('home', { categories, projects, pageTitle: selectedCategory.name });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading category page.');
  }
});

// Admin Page
app.get('/admin', async (req, res) => {
  try {
    const categories = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM categories', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.render('admin', { categories });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading admin page.');
  }
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});