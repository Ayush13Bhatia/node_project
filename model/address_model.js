module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    'Address',
    {
      address_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      address_1: {
        type: DataTypes.STRING,
      },
      address_2: {
        type: DataTypes.STRING,

      },
      city_id: {
        type: DataTypes.STRING,
      },
      state_id: {
        type: DataTypes.STRING,
      },
      country_id: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'address_table',
      timestamps: false,
    }
  );

  return Address;
};
