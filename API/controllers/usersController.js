const { use } = require("js-joda");
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
                const token ='1234567890';
                res.json({
                    token
                });
            }
        });
    }
  }

const userController = new UserController();
module.exports = userController;