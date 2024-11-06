const pool = require('../src/Infrastructures/database/postgres/pool');

const threadTableHelpTest = {
    async addThread({
        id ='thread-123',        
        title ='helloword',
        content ='ini konten',
        owner = 'user-123'
    }){
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4)',
            values: [id, title, content, owner,],
        };
        const result = await pool.query(query);
        
        return result.rows
    },
    async findThreadById(id){
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id],
          };
      
          const result = await pool.query(query);
          return result.rows;
    },

    async cleanTable(){
        await pool.query('TRUNCATE TABLE threads');
    }
}

module.exports = threadTableHelpTest;