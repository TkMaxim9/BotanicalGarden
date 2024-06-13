const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');


// Регистрация
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const role = 'gardener'; // Устанавливаем роль по умолчанию

  const passwordHash = await bcrypt.hash(password, 10);

  db.execute('INSERT INTO Users (Username, PasswordHash, Role) VALUES (?, ?, ?)', [username, passwordHash, role], (err) => {
    if (err) {
      return res.status(500).send('Ошибка регистрации пользователя');
    }
    res.status(201).send('Пользователь успешно зарегистрирован');
  });
});

// Вход пользователей
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.execute('SELECT UserID, PasswordHash, Role FROM Users WHERE Username = ?', [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).send('Неверные учетные данные');
    }

    const user = results[0];
    const isValidPassword = await bcrypt.compare(password, user.PasswordHash);

    if (!isValidPassword) {
      return res.status(401).send('Неверные учетные данные');
    }

    // Установка сессии
    req.session.userId = user.UserID;
    req.session.role = user.Role;
    res.send('Успешный вход');
  });
});

// Маршрут для получения текущего пользователя
router.get('/current_user', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Неавторизованный доступ');
  }

  db.execute('SELECT UserID, Username, Role FROM Users WHERE UserID = ?', [req.session.userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).send('Пользователь не найден');
    }

    const user = results[0];
    res.json(user);
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Ошибка при выходе из аккаунта');
    }
    res.clearCookie('connect.sid');
    res.status(200).send('Успешный выход из аккаунта');
  });
});


module.exports = router;