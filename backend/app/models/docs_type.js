"use strict";

module.exports = (sequelize, DataTypes) => {
    const Docs_Type = sequelize.define(
        "docs_type",
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            nama: { type: DataTypes.STRING, allowNull: false },
        },
        {
            timestamps: true, // hapus kalau pakai createdAt/updatedAt
        }
    );

    return Docs_Type;
};
