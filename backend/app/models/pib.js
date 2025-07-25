// table PIB
// - id (PK) INT
// - id_penjual (FK) INT
// - id_importir (FK) INT
// - id_sarana_pengangkutan (FK) INT
// - tipe_pengangkutan ENUM/VARCHAR (kalau sudah jelas pakai enum saja)
// - pelabuhan_pemuat VARCHAR(255)
// - pelabuhan_tujuan VARCHAR(255)
// - tanggal_berangkat DATETIME
// - NDPBM (Nilai Dasar Penghitungan Bea Masuk) DOUBLE

"use strict";

module.exports = (sequelize, DataTypes) => {
  const PIB = sequelize.define(
    "pib",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    },
    {
      timestamps: true, // hapus kalau pakai createdAt/updatedAt
    }
  );

  return PIB;
};
