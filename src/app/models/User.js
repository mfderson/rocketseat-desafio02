import Sequelize, { Model } from 'sequelize';

class User extends Model {
  // Este método é chamado automaticamente pelo sequelize
  static init(sequelize) {
    // Contém todas as colunas excluindo PK, FK, created_at e updated_at
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default User;
