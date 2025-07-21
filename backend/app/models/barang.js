// Table barang
// - part_number {PK) VARCHAR(255)
// - id_instansi (FK) (NULLABLE) INT
// - hscode VARCHAR(255)
// - deskripsi TEXT
// - pos_tarif DOUBLE
// - status_lartas ENUM
// - satuan VARCHAR(25)

"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Barang extends Model {
    static associate(models) {
      Barang.belongsTo(models.instansi, {
        foreignKey: id_instansi,
        targetKey: "id",
        allowNull: "true",
        onDelete: "CASCADE",
      });
    }
  }
  Barang.init({
    part_number: { type: DataTypes.STRING, primaryKey: true },
    hs_code: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    pos_tarif: DataTypes.DOUBLE,
    status_lartas: DataTypes.ENUM(
      "Lartas Export",
      "Lastas Import",
      "Non-Lartas"
    ),
    satuan: DataTypes.STRING,
  });
};
