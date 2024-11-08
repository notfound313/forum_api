/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('threads',{
        id : {
            type:'VARCHAR(50)',
            primaryKey : true,
            notNull: true,

        },
        title: {
            type: 'VARCHAR(255)', 
            notNull: true         
        },
        body: {
            type: 'TEXT',         
            notNull: true        
        },
        owner: {
            type: 'VARCHAR(50)',      
            notNull: true         
        },        
        created_at: {
            type: 'TIMESTAMP',    
            default: pgm.func('CURRENT_TIMESTAMP') 
        },
        updated_at: {
            type: 'TIMESTAMP',    
            default: pgm.func('CURRENT_TIMESTAMP'), 
            onUpdate: pgm.func('CURRENT_TIMESTAMP') 
        },
        is_deleted: {
            type: 'BOOLEAN',         
            default: false,      
        },        
        
    });
    pgm.addConstraint('threads', 'fk_threads.owner_users.id', {
            foreignKeys: {
                columns: 'owner',
                references: 'users(id)',
                onDelete: 'CASCADE',
            }
        });
    
};

exports.down = pgm => {
    pgm.dropTable('threads')
};
