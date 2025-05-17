module.exports = (Sequelize, DataType) => {
    const product_mode = Sequelize.define(
        'product', {
        product_id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        category_id: {
            type: DataType.INTEGER,
        },
        product_name: DataType.STRING,
        description: DataType.STRING,
        price: DataType.INTEGER,
        created_at: DataType.STRING

    }, {
        tableName: 'product_table',
        timestamps: false,
    }
    );
    return product_mode;
}