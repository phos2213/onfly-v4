import 'dotenv/config';
import app from './app.js';
import { migrate } from './database/db.js';

const PORT = process.env.PORT || 3001;

migrate()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to migrate database:', err);
    process.exit(1);
  });
