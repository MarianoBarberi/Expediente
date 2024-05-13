const mysql = require("../database/db");

class MainController {
  async getAllCarsOfClient(req, res) {
    console.log("Get cars");
    var sql = `CALL GetClientCars(?);`;
    mysql.query(sql, [req.params.id], (error, data, fields) => {
      if (error) {
        res.status(500);
        res.send(error.message);
      } else {
        console.log(data);
        var cars = data[0];
        res.json({
          cars,
        });
      }
    });
  }

  async getCar(req, res) {
    const { id } = req.params;
    console.log("Get car");
    var sql = `SELECT * FROM cars WHERE id = ?;`;
    mysql.query(sql, [id], (error, data, fields) => {
      if (error) {
        res.status(500);
        res.send(error.message);
      } else {
        console.log(data);
        var car = data[0];
        res.json({
          car,
        });
      }
    });
  }

  async getClientName(req, res) {
    const { id } = req.params;
    console.log("Get client name");
    var sql = `CALL GetClientName(?);`;
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