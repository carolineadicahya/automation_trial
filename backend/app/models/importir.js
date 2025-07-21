// Table importir
// - id (PK) INT
// - NITKU (UNIQUE) VARCHAR(50)
// - NIB (UNIQUE) VARCHAR(50)
// - alamat TEXT

"use strict";

module.exports = (sequelize, DataTypes) => {
  const Importir = sequelize.define(
    "importir",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nitku: { type: DataTypes.STRING, unique: true },
      nib: { type: DataTypes.STRING, unique: true },
      alamat: DataTypes.TEXT,
    },
    {
      timestamps: true, // hapus kalau pakai createdAt/updatedAt
    }
  );

  return Importir;
};
