const mysql = require("../database/db");

class UserController {
    async loginUser(req, res) {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
  
      try {
        const [rows, fields] = await mysql.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        if (rows.length === 0) {
          return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = 'your_token'; // Generate a token here or use any authentication mechanism
        res.json({ message: 'Login successful', token });
      } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

const userController = new UserController();
module.exports = userController;