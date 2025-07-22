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
      id_penjual: DataTypes.INTEGER,
      id_importir: DataTypes.INTEGER,
      id_sarana_pengangkutan: DataTypes.INTEGER,
      tipe_pengangkutan: DataTypes.ENUM("Laut", "Udara"),
      pelabuhan_pemuat: DataTypes.STRING,
      pelabuhan_tujuan: DataTypes.STRING,
      tanggal_berangkat: DataTypes.DATE,
      ndpbm: DataTypes.DOUBLE,
    },
    {
      timestamps: true, // hapus kalau pakai createdAt/updatedAt
    }
  );

  // Definisi relasi
  // Penjual
  PIB.associate = (models) => {
    PIB.belongsTo(models.penjual, {
      foreignKey: "id_penjual",
      targetKey: "id",
      allowNull: false,
      onDelete: "CASCADE",
    });

    PIB.belongsTo(models.importir, {
      foreignKey: "id_importir",
      targetKey: "id",
      allowNull: false,
      onDelete: "CASCADE",
    });

    PIB.belongsTo(models.sarana_pengangkutan, {
      foreignKey: "id_sarana_pengangkutan",
      targetKey: "id",
      allowNull: false,
      onDelete: "CASCADE",
    });
  };

  return PIB;
};
