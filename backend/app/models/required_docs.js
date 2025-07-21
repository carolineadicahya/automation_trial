// Table required_docs
// - id (PK) INT
// - tipe_dokumen VARCHAR(255)

"use strict";

module.exports = (sequelize, DataTypes) => {
  const Required_Docs = sequelize.define(
    "required_docs",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      id_barang: DataTypes.STRING,
      tipe_dokumen: DataTypes.STRING,
    },
    {
      timestamps: true, // hapus kalau pakai createdAt/updatedAt
    }
  );

  Required_Docs.associate = (models) => {
    Required_Docs.belongsTo(models.barang, {
      foreignKey: "id_barang",
      targetKey: "part_number",
      allowNull: false,
      onDelete: "CASCADE",
    });
  };

  return Required_Docs;
};
