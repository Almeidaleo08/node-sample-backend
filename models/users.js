import bcrypt from "bcryptjs";

module.exports = (sequelize, DataType) => {
	const Users = sequelize.define("Users", {
		id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		password: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		email: {
			type: DataType.STRING,
			unique: true,
			primaryKey: false,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		phone: {
			type: DataType.STRING,
			unique: false,
			primaryKey: false,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		status: {
			type: DataType.STRING,
			unique: false,
			primaryKey: false,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		createUserIp: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		lastUserIp: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
	}, {
			hooks: {
				beforeCreate: user => {
					const salt = bcrypt.genSaltSync();
					user.password = bcrypt.hashSync(user.password, salt);
				},
				beforeUpdate: user => {
					const salt = bcrypt.genSaltSync();
					user.password = bcrypt.hashSync(user.password, salt);
				}
			},
			classMethods: {
				associate: models => {
					//Users.hasMany(models.Houses, { onDelete: 'cascade' });
				},
				isPassword: (encodedPassword, password) => {
					return bcrypt.compareSync(password, encodedPassword);
				}
			}
		});
	return Users;
};