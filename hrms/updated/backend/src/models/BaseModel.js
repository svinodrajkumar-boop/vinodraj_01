const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class BaseModel {
static init(attributes, options = {}) {
const model = sequelize.define(this.name, {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true
},
...attributes,
created_at: {
type: DataTypes.DATE,
allowNull: false,
defaultValue: DataTypes.NOW
},
updated_at: {
type: DataTypes.DATE,
allowNull: false,
defaultValue: DataTypes.NOW
}
}, {
tableName: this.getTableName(),
timestamps: true,
underscored: true,
hooks: {
beforeUpdate: (instance) => {
instance.updated_at = new Date();
}
},
...options
});

// Store the model in class property
this.model = model;
return model;
}

static getTableName() {
// Convert PascalCase to snake_case for table names
return this.name
.replace(/([A-Z])/g, '_$1')
.toLowerCase()
.substring(1);
}

static associate(models) {
// To be overridden by child classes
}

// Instance methods
toJSON() {
const values = Object.assign({}, this.get());

// Remove sensitive fields
delete values.password_hash;
delete values.two_factor_secret;

// Format dates
if (values.created_at) values.created_at = values.created_at.toISOString();
if (values.updated_at) values.updated_at = values.updated_at.toISOString();

return values;
}
}

module.exports = BaseModel;