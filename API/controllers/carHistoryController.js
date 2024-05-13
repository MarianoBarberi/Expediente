const mysql = require("../database/db");

class MainController {
  async getAllCarHistoryOfCar(req, res) {
    console.log("get all car history of car");
    var sql = `CALL GetCarHistory(?);`;
    mysql.query(sql, [req.params.id], (error, data, fields) => {
      if (error) {
        res.status(500);
        res.send(error.message);
      } else {
        console.log(data);
        var carHistory = data[0];
        res.json({
          carHistory,
        });
      }
    });
  }

  async getCarName(req, res) {
    const { id } = req.params;
    console.log("Get car name");
    var sql = `CALL GetCarName(?);`;
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

}

const ClientsController = new MainController();
module.exports = ClientsController;