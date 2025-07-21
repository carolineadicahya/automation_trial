// table instansi
// - id (PK) INT
// - nama_instansi (UNIQUE) VARCHAR(255)

"use strict";

module.exports = (sequelize, DataTypes) => {
  const Instansi = sequelize.define(
    "instansi",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nama_instansi: DataTypes.STRING,
    },
    {
      timestamps: true, // hapus kalau pakai createdAt/updatedAt
    }
  );

  return Instansi;
};
