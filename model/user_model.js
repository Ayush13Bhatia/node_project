    module.exports = (sequelize, DataType) => {
    const user_model = sequelize.define(
        'User', {
            user_id: {
                type: DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,

            },
            user_name: DataType.STRING,
            user_email: DataType.STRING,
            password: DataType.STRING,
            dob: DataType.STRING,
            created_date: DataType.STRING
        },{
            tableName: 'user_table',
            timestamps: false,
        }
    );

    return user_model;
}