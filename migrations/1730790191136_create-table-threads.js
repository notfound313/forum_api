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
        content: {
            type: 'TEXT',         
            notNull: true        
        },
        user_id: {
            type: 'INTEGER',      
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
            default: true,      
        },        
        
    })
};

exports.down = pgm => {
    pgm.dropTable('threads')
};
