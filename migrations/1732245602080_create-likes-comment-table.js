/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,

    },
    thread_id: {
      type: 'VARCHAR(50)',
      references: 'threads(id)',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      references: 'comments(id)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      references: 'users(id)',
      notNull: true,
    },
    is_deleted: {
      type: 'BOOLEAN',
      default: false,
    },
  });

  pgm.addConstraint('comment_likes', 'unique_user_id_and_comment_id_and_thread_id', {
    unique: ['user_id', 'comment_id', 'thread_id'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comment_likes');
};
