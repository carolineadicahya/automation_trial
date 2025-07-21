// Table penjual
// - id (PK) INT
// - nama VARCHAR(255)
// - alamat TEXT

"use strict";

module.exports = (sequelize, DataTypes) => {
  const Penjual = sequelize.define(
    "penjual",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nama: DataTypes.STRING,
      alamat: DataTypes.TEXT,
    },
    {
      timestamps: true, // hapus kalau pakai createdAt/updatedAt
    }
  );

  return Penjual;
};
