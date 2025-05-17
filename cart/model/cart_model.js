module.exports = (sequelize, DataType) => {
    const cart_model = sequelize.define(
        'cart',
        {
            cart_id: {
                type: DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            product_id: DataType.INTEGER,
            user_id: DataType.INTEGER
        }, {
        tableName: 'cart_table',
        timestamps: false,
    }
    );

    return cart_model;
}
