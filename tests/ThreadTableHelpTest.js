const pool = require('../src/Infrastructures/database/postgres/pool');

const threadTableHelpTest = {
    async addThread({
        title ='helloword',
        content ='ini konten',
        owner = 'user-123'
    }){
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3)',
            values: [title, content, owner],
        };
        const result = await pool.query(query);
        
        return result.rows
    },

    async cleanTable(){
        await pool.query('TRUNCATE TABLE threads');
    }
}

module.exports = threadTableHelpTest;