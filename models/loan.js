'use strict';
module.exports = (sequelize, DataTypes) => {
  var Loan = sequelize.define('Loan', {
    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Book ID is required'
        }
      }
    },
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Patron ID is required'
        },
        not: {
          args: /[a-zA-Z!@#$%\^&*()_+=[\]{}:;'".,/\\?`~\-<>]/gim,
          msg: 'Patron ID may only contain numbers'
        }
      }
    },
    loaned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: {
          msg: 'Loaned Date is required'
        },
        isDate: {
          msg: 'Loaned on must be a date'
        }
      }
    },
    return_by: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: {
          msg: 'Return Date is required'
        },
        isDate: {
          msg: 'Return by must be a date'
        },
        isAfter: {
          args: Date('now'),
          msg: 'Please enter valid return date'
        }
      }
    },
    returned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: 'Return by must be a date'
        }
      }
    }
  });

  Loan.associate = function(models) {
    Loan.belongsTo(models.Book, { foreignKey: "book_id" });
    Loan.belongsTo(models.Patron, { foreignKey: "patron_id" });
  };

  return Loan;
};
