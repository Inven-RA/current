const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
const port = 8000;

// Enable CORS for all routes
app.use(cors());

// Create a new database instance
const db = new sqlite3.Database(':memory:'); // Replace with a file path to create a persistent database

// Create the necessary tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS iaps (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS objectives (
      id INTEGER PRIMARY KEY,
      iap_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      FOREIGN KEY (iap_id) REFERENCES iaps(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY,
      acid STRING NOT NULL,
      name TEXT NOT NULL,
      description TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY,
      activity_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      api_link TEXT NOT NULL,
      FOREIGN KEY (activity_id) REFERENCES activities(id)
    )
  `);

  db.run(`
  CREATE TABLE IF NOT EXISTS objectivesanalytics (
    objective_id INTEGER NOT NULL,
    analytics_id INTEGER NOT NULL,
    weight INTEGER NOT NULL,
    FOREIGN KEY (objective_id) REFERENCES objectives(id),
    FOREIGN KEY (analytics_id) REFERENCES analytics(id)
  )
  `);

  db.run(`
  CREATE TABLE IF NOT EXISTS flagsobjectives (
    flag_id INTEGER NOT NULL,
    objective_id INTEGER NOT NULL,
    FOREIGN KEY (objective_id) REFERENCES objectives(id),
    FOREIGN KEY (flag_id) REFERENCES flags(id)
  )
  `);


  db.run(`
    CREATE TABLE IF NOT EXISTS flags (
      id INTEGER PRIMARY KEY,
      analytics_id INTEGER NOT NULL,
      min_value INTEGER NOT NULL,
      max_value INTEGER NOT NULL,
      flag NVARCHAR(100) NOT NULL,
      FOREIGN KEY (analytics_id) REFERENCES analytics(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL,
      analytics_id INTEGER NOT NULL,
      objective_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (analytics_id) REFERENCES analytics(id),
      FOREIGN KEY (objective_id) REFERENCES objectives(id)
    )
  `);


db.run(`INSERT INTO users (id) VALUES (1)`);
db.run(`INSERT INTO users (id) VALUES (2)`);
db.run(`INSERT INTO users (id) VALUES (3)`);
db.run(`INSERT INTO users (id) VALUES (4)`);
db.run(`INSERT INTO users (id) VALUES (5)`);
db.run(`INSERT INTO users (id) VALUES (6)`);
db.run(`INSERT INTO users (id) VALUES (7)`);
db.run(`INSERT INTO users (id) VALUES (8)`);
db.run(`INSERT INTO users (id) VALUES (9)`);

db.run(`INSERT INTO activities (id, acid, name, description) VALUES (1, '64a3fa101345d4b792686a56' ,'Group Roles', 'Simple Activity for directing students to choose a role')`);
db.run(`INSERT INTO activities (id, acid, name, description) VALUES (2, '64a7420fd0ea814cd4a33568', 'Youtube Video', 'Link to a youtube video' )`);

// ------------------------------
// IAP 
db.run(`INSERT INTO iaps (id, name, description) VALUES (1, 'Group Roles & Youtube Video', 'Form Group Roles and watch a Youtube Video')`);

// Obj 1
db.run(`INSERT INTO objectives (id, iap_id, name) VALUES (1, 1, 'Form Group Roles')`);

db.run('INSERT INTO flagsobjectives (flag_id, objective_id) VALUES (1, 1)');
db.run('INSERT INTO flagsobjectives (flag_id, objective_id) VALUES (2, 1)');
db.run('INSERT INTO flagsobjectives (flag_id, objective_id) VALUES (3, 1)');
db.run('INSERT INTO flagsobjectives (flag_id, objective_id) VALUES (4, 1)');

// Analytics 1
db.run(`INSERT INTO analytics (id, activity_id, name, api_link, type) VALUES (1, 1, 'Form Groups', 'http://localhost:3000/', 'Qualitative')`);
db.run('INSERT INTO objectivesanalytics (objective_id, analytics_id, weight) VALUES (1, 1, 100)');

db.run(`INSERT INTO flags (id, analytics_id, min_value, max_value, flag) VALUES (1, 1, 0, 50, '😵')`);
db.run(`INSERT INTO flags (id, analytics_id, min_value, max_value, flag) VALUES (2, 1, 51, 100, '🥳')`);

// Obj 2
db.run(`INSERT INTO objectives (id, iap_id, name) VALUES (2, 1, 'Watch a youtube video')`);

db.run('INSERT INTO flagsobjectives (flag_id, objective_id) VALUES (5, 2)');
db.run('INSERT INTO flagsobjectives (flag_id, objective_id) VALUES (6, 2)');
db.run('INSERT INTO flagsobjectives (flag_id, objective_id) VALUES (7, 2)');
db.run('INSERT INTO flagsobjectives (flag_id, objective_id) VALUES (8, 2)');

// Analytics 2
db.run(`INSERT INTO analytics (id, activity_id, name, api_link, type) VALUES (2, 2, 'Watch Video', 'http://localhost:3456/youtube', 'Qualitative')`);
db.run('INSERT INTO objectivesanalytics (objective_id, analytics_id, weight) VALUES (2, 2, 100)');

db.run(`INSERT INTO flags (id, analytics_id, min_value, max_value, flag) VALUES (3, 2, 0, 50, '😵')`);
db.run(`INSERT INTO flags (id, analytics_id, min_value, max_value, flag) VALUES (4, 2, 51, 100, '🥳')`);


});

// Define your API routes
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/users', (req, res) => {
  const { id } = req.body;
  db.run('INSERT INTO users (id) VALUES (?)', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});



// Define your API routes
app.get('/iaps', (req, res) => {
  db.all('SELECT * FROM iaps', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/iaps', (req, res) => {
  console.log(req);
  const { name } = req.body;
  db.run('INSERT INTO iaps (name) VALUES (?)', [name], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

// Define your API routes
app.get('/objectives', (req, res) => {
   const { id } = req.query;

  let query = 'SELECT * FROM objectives';
  let params = [];

  if (id) {
    query = `SELECT * FROM objectives WHERE id = ?`;
    params = id;
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/objectives', (req, res) => {
  const { iap_id, name } = req.body;
  db.run('INSERT INTO objectives (iap_id, name) VALUES (?, ?)', [iap_id, name], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

// Define your API routes
/*app.get('/objectivesanalytics', (req, res) => {
  db.all('SELECT * FROM objectivesanalytics', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});*/
app.get('/objectivesanalytics', (req, res) => {
  const { acid } = req.query;

  let query = 'SELECT * FROM objectivesanalytics';
  let params = [];

  if (acid) {
    query = `SELECT * FROM objectivesanalytics WHERE analytics_id = ?`;
    params = acid;
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});
app.get('/get_analytics_type', (req, res) => {
  const { analytics_id } = req.query;

  let query = 'SELECT * FROM analytics';
  let params = [];

  if (analytics_id) {
    query = `SELECT type FROM analytics WHERE id = ?`;
    params = analytics_id;
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/objectivesanalytics', (req, res) => {
  const { objective_id, analytics_id, weight } = req.body;
  db.run('INSERT INTO objectivesanalytics (objective_id, analytics_id, weight) VALUES (?, ?, ?)', [objective_id, analytics_id, weight], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

// Define your API routes
app.get('/flagsobjectives', (req, res) => {
  db.all('SELECT * FROM flagsobjectives', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/flagsobjectives', (req, res) => {
  const { flag_id, objective_id } = req.body;
  db.run('INSERT INTO flagsobjectives (flag_id, objective_id) VALUES (?, ?)', [flag_id, objective_id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});



// Define your API routes
app.get('/activities', (req, res) => {
  const { acid } = req.query;

  let query = 'SELECT * FROM activities';
  let params = [];

  if (acid) {
    query = `SELECT * FROM activities WHERE acid = ?`;
    params = acid;
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
  /*
  db.all('SELECT * FROM activities', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });*/
});

app.post('/activities', (req, res) => {
  const { name } = req.query;
  db.run('INSERT INTO activities (name) VALUES (?)', [name], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

// Define your API routes
app.get('/analytics', (req, res) => {
  const { activity_id } = req.query;

  let query = 'SELECT * FROM analytics';
  let params = [];

  if (activity_id) {
    const activityIds = Array.isArray(activity_id) ? activity_id : [activity_id];
    const placeholders = activityIds.map(() => '?').join(', ');
    query = `SELECT * FROM analytics WHERE activity_id IN (${placeholders})`;
    params = activityIds;
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Define your API routes
app.get('/allAnalytics', (req, res) => {
  db.all('SELECT * FROM analytics', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});




app.post('/analytics', (req, res) => {
  const { activity_id, name, api_link, type } = req.body;
  db.run('INSERT INTO analytics (activity_id, name, api_link, type) VALUES (?, ?, ?, ?)', [activity_id, name, api_link, type], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

// Define your API routes
app.get('/flags', (req, res) => {
  db.all('SELECT * FROM flags', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/flags', (req, res) => {
  const { analytics_id, min_value, max_value, flag } = req.body;
  db.run('INSERT INTO flags (analytics_id, min_value, max_value, flag) VALUES (?, ?, ?, ?)', [analytics_id, min_value, max_value, flag], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});



app.get('/scores', (req, res) => {
  db.all('SELECT * FROM scores', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/scores', (req, res) => {
  const { user_id, analytics_id, objective_id, score } = req.body;
  db.run('INSERT INTO scores (user_id, analytics_id, objective_id, score) VALUES (?, ?, ?, ?)', [user_id, analytics_id, objective_id, score], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

app.put('/scores/', (req, res) => {
  const { id } = req.params;
  const { score } = req.body;

  db.get('SELECT * FROM scores WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      if (row) {
        // Score existente encontrado, atualizar se o novo score for maior
        if (score > row.score) {
          db.run('UPDATE scores SET score = ? WHERE id = ?', [score, id], function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.json({ rowsAffected: this.changes });
            }
          });
        } else {
          res.json({ message: 'O score existente é maior ou igual. Nenhuma atualização necessária.' });
        }
      } else {
        // Nenhum score existente encontrado, enviar um novo registro
        db.run('INSERT INTO scores (user_id, analytics_id, objective_id, score) VALUES (?, ?, ?, ?)', [user_id, analytics_id, objective_id, score], function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.json({ id: this.lastID });
          }
        });
      }
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
