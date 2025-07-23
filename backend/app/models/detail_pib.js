// tabel detail_pib
// - id (PK) INT
// - id_barang (FK) INT
// - jumlah INT
// - dimensi INT - CHANGED data type to VARCHAR
// - mata_uang VARCHAR(255)
// - fob INT - DEPRECATED changed to no_invoice
// - cif INT - DEPRECATED changed to no_bl

"use strict";

module.exports = (sequelize, DataTypes) => {
  const Detail_PIB = sequelize.define(
    "detail_pib",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      id_barang: DataTypes.STRING,
      id_pib: DataTypes.INTEGER,
      jumlah: { type: DataTypes.INTEGER, allowNull: false },
      no_invoice: { type: DataTypes.STRING, allowNull: false },
      no_bl: { type: DataTypes.STRING, allowNull: false },
    },
    {
      timestamps: true, // hapus kalau pakai createdAt/updatedAt
    }
  );

  // Relasi ke model Barang
  Detail_PIB.associate = (models) => {
    Detail_PIB.belongsTo(models.barang, {
      foreignKey: "id_barang",
      targetKey: "part_number",
      allowNull: false,
      onDelete: "CASCADE",
    });

    // fk pib
    Detail_PIB.belongsTo(models.pib, {
      foreignKey: "id_pib",
      targetKey: "id",
      allowNull: false,
      onDelete: "CASCADE",
    });
  };

  return Detail_PIB;
};
