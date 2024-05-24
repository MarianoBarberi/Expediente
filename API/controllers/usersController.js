const mysql = require("../database/db");

class UserController {
    async loginUser(req, res) {
        const { username, password } = req.body;
        console.log("Login user");
        var sql = `SELECT * FROM users WHERE username = ? AND password = ?;`;
        mysql.query(sql, [username, password], (error, data, fields) => {
            if (error) {
                res.status(500);
                res.send(error.message);
            } else {
                console.log(data);
                var user = data[0];
                if (user) {
                    const token = "1234567890";
                    res.json({
                        token,
                    });
                } else {
                    res.status(401);
                    res.send("Invalid username or password");
                }
            }
        });
    }
}

const userController = new UserController();
module.exports = userController;
