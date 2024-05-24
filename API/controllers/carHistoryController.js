const mysql = require("../database/db");

class MainController {
  async getAllCarHistoryOfCar(req, res) {
        console.log("get all car history of car");
        const sql = `CALL GetCarHistory(?);`;

        try {
            const connection = await db.getConnection();
            const [data] = await connection.execute(sql, [req.params.id]);
            connection.end();

            console.log(data);
            const carHistory = data[0];
            res.json({ carHistory });
        } catch (error) {
            res.status(500).send(error.message);
        }
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

  async addCarHistory(req, res) {
    const { service_of_car, service_date, service_date_end, comments, car_id } = req.body;
    console.log("add car history");
    var sql = `INSERT INTO carhistory (service_of_car, service_date, service_date_end, comments, car_id) VALUES (?, ?, ?, ?, ?);`;
    mysql.query(sql, [service_of_car, service_date, service_date_end, comments, car_id], (error, data, fields) => {
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

  async editCarHistory(req, res) {
    const { id } = req.params;
    const { service_of_car, service_date, service_date_end, comments } = req.body;
    console.log("edit car history");
    var sql = `UPDATE carhistory SET service_of_car = ?, service_date = ?, service_date_end = ?, comments = ? WHERE id = ?;`;
    mysql.query(sql, [service_of_car, service_date, service_date_end, comments, id], (error, data, fields) => {
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

  async deleteCarHistory(req, res) {
    const { id } = req.params;
    console.log("delete car history");
    var sql = `DELETE FROM carhistory WHERE id = ?;`;
    mysql.query(sql, [id], (error, data, fields) => {
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

}

const ClientsController = new MainController();
module.exports = ClientsController;