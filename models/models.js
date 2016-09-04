var sequelize = require("sequelize");
var DataType = require('sequelize/lib/data-types');

var User = sequelize.define('user', {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataType.STRING,
    field: 'first_name', // Will result in an attribute that is firstName when user facing but first_name in the database
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  lastName: {
    type: DataType.STRING
  },
  team: {
    type: DataType.STRING,
    defaultValue: 'fenerbahce',
    validate: {
      isIn: [['fenerbahce', 'galatasaray', 'besiktas']],
    }
  }
}, {
    freezeTableName: true, // Model tableName will be the same as the model name
    paranoid: true // Logical Delete instead of Physical Delete
  });



User.sync({ force: true }).then(function () {
  // Table created
  return User.create({
    firstName: 'Burak',
    lastName: 'Donbay'
  });
});