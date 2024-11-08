/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('comments', {
        id: {
          type: 'VARCHAR(50)', 
          primaryKey: true,
          notNull: true,
        },
        thread_id: {
          type: 'VARCHAR(50)',
          notNull: true,
          references: 'threads(id)', 
          onDelete: 'CASCADE', 
        },
        content: {
          type: 'TEXT',
          notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users(id)', 
            onDelete: 'CASCADE', 
          },
        created_at: {
          type: 'timestamp',
          default: pgm.func('current_timestamp'),
        },
        
        is_deleted: {
            type: 'BOOLEAN',         
            default: false,      
        },
      });
    
};

exports.down = pgm => {
    pgm.dropTable('comments');
};
