const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'sqlite', 'portfolio.db');
const db = new sqlite3.Database(dbPath);

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    image TEXT,
    description TEXT,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  )`);

  // Clear old data
  db.run('DELETE FROM categories');
  db.run('DELETE FROM projects');

  // Insert categories
  const colors = ['Blue', 'Red', 'Yellow', 'Green', 'Purple', 'Rainbow'];
  colors.forEach(color => {
    db.run('INSERT INTO categories (name) VALUES (?)', [color]);
  });

  // Insert projects
  const projects = [
    { title: 'Prism Energy : August 2020', image: 'blue art 1.jpg', description: 'Energy bursts through a prismatic wave.', category: 'Blue' },
    { title: 'Cosmic Fade : April 2024', image: 'blue art 2.jpg', description: 'The slow blending of stars into cosmic color.', category: 'Blue' },
    { title: 'Spectrum Dance : October 2021', image: 'blue art 3.jpg', description: 'Lights collide and melt into the full rainbow.', category: 'Blue' },
    { title: 'Twilight Bloom : June 2022', image: 'red art 1.jpg', description: 'Flowers bathed in the softest twilight glow.', category: 'Red' },
    { title: 'Mystic Shard : January 2023', image: 'red art 2.jpg', description: 'Sharp, crystalized fragments of forgotten magic.', category: 'Red' },
    { title: 'Amethyst Glare : November 2020', image: 'red art 3.jpg', description: 'A sparkling vision of dreams wrapped in purple.', category: 'Red' },
    { title: 'Forest Echo : May 2021', image: 'green art 1.jpg', description: 'Whispers of an ancient forest.', category: 'Green' },
    { title: 'Verdant Pulse : July 2022', image: 'green art 2.jpg', description: 'The vibrant heartbeat of earth’s energy.', category: 'Green' },
    { title: 'Emerald Drift : March 2023', image: 'green art 3.jpg', description: 'A mist of emerald floating softly.', category: 'Green' },
    { title: 'Velvet Dreams : December 2020', image: 'purple art 1.jpg', description: 'Midnight dreams draped in velvet.', category: 'Purple' },
    { title: 'Lilac Mirage : May 2022', image: 'purple art 2.jpg', description: 'A shimmering illusion of lilac mist.', category: 'Purple' },
    { title: 'Plum Reverie : September 2023', image: 'purple art 3.jpg', description: 'A deep plum-colored daydream.', category: 'Purple' },
    { title: 'Rainbow Drift : August 2021', image: 'rainbow art 1.jpg', description: 'A soft dance across all colors.', category: 'Rainbow' },
    { title: 'Chroma Pulse : February 2022', image: 'rainbow art 2.jpg', description: 'Pulses of light in full spectrum.', category: 'Rainbow' },
    { title: 'Aurora Whisper : October 2023', image: 'rainbow art 3.jpg', description: 'The faint song of a rainbow aurora.', category: 'Rainbow' }
  ];

  projects.forEach(proj => {
    db.run(
      `INSERT INTO projects (title, image, description, category_id)
       VALUES (?, ?, ?, (SELECT id FROM categories WHERE name = ?))`,
      [proj.title, proj.image, proj.description, proj.category]
    );
  });
});

db.close();

