const mysql = require("../database/db");

class MainController {
    async getAllClients(req, res) {
      console.log("Get clients");
      var sql = `CALL GetAllClients();`;
      mysql.query(sql, (error, data, fields) => {
        if (error) {
          res.status(500);
          res.send(error.message);
        } else {
          console.log(data);
          // Extract the first element of the data array
          var clients = data[0];
          res.json({
            clients,
          });
        }
      });
    }
  
  

  async getClient(req, res) {
    const { id } = req.params;
    console.log("Get client");
    var sql = `SELECT * FROM client WHERE id = ?;`;
    mysql.query(sql, [id], (error, data, fields) => {
      if (error) {
        res.status(500);
        res.send(error.message);
      } else {
        console.log(data);
        var client = data[0];
        res.json({
          client,
        });
      }
    });
  }

}

const ClientsController = new MainController();
module.exports = ClientsController;