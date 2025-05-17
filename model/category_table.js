module.exports = (sequelie, DataType) => {
    const category_model = sequelie.define(
        'category',
        {
            category_id: {
                type: DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            category_name: {
                type: DataType.STRING,
            }
        }, {
        tableName: 'category_table',
        timestamps: false,
    }
    );
    return category_model;
}