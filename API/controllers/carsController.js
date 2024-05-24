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

  async getAllCars(req, res) {
    console.log("Get all cars");
    var sql = `CALL GetAllCars();`;
    mysql.query(sql, (error, data, fields) => {
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
    }
    );
  }

  async getCar(req, res) {
    const { id } = req.params;
    console.log("Get car");
    var sql = `SELECT * FROM car WHERE id = ?;`;
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

  async addCar(req, res) {
    const { name, year_of_car, color, km, last_time_date, comments, client_id, isInTaller } = req.body;
    console.log("Add car");
    var sql = `INSERT INTO cars (name, year_of_car, color, km, last_time_date, comments, client_id, isInTaller) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
    mysql.query(sql, [name, year_of_car, color, km, last_time_date, comments, client_id, isInTaller], (error, data, fields) => {
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

  async editCar(req, res) {
    const { id } = req.params;
    const { name, year_of_car, color, km, last_time_date, comments, client_id, isInTaller } = req.body;
    console.log("Edit car");
    var sql = `UPDATE cars SET name = ?, year_of_car = ?, color = ?, km = ?, last_time_date = ?, comments = ?, client_id = ?, isInTaller = ? WHERE id = ?;`;
    mysql.query(sql, [name, year_of_car, color, km, last_time_date, comments, client_id, isInTaller, id], (error, data, fields) => {
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

  async deleteCar(req, res) {
    const { id } = req.params;
    console.log("Delete car");
    var sql = `DELETE FROM cars WHERE id = ?;`;
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