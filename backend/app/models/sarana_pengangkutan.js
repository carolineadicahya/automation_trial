// table sarana_pengangkutan
// - id (PK) INT
// - nama VARCHAR(255)
// - nomor_identitas VARCHAR(255)
// - bendera VARCHAR(255)

"use strict";

module.exports = (sequelize, DataTypes) => {
  const Sarana_Pengangkutan = sequelize.define(
    "sarana_pengangkutan",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nama: DataTypes.STRING,
      nomor_identitas: DataTypes.STRING,
      bendera: DataTypes.STRING,
    },
    {
      timestamps: true, // hapus kalau pakai createdAt/updatedAt
    }
  );

  return Sarana_Pengangkutan;
};
