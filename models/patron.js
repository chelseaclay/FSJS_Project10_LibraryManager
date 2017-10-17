'use strict';
module.exports = (sequelize, DataTypes) => {
  var Patron = sequelize.define('Patron', {
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Title is required'
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Title is required'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Title is required'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Title is required'
        }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Title is required'
        }
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Title is required'
        }
      }
    }
  });

  Patron.associate = function(models) {
    Patron.hasMany(models.Loan, { foreignKey: "patron_id" });
  };

  return Patron;
};
