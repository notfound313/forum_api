
const { query } = require('@hapi/hapi/lib/validation')
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedThread = require('../../Domains/threads/entities/AddedThread')
class ThreadRepositoryPostgres extends ThreadRepository{
    constructor(pool, idGenerator){
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }
    async addThread(payload){
        const {title, content, owner} = payload
        const id = `thread-${this._idGenerator()}`
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2,$3, $4) RETURNING id, title, owner',
            values:[id, title, content, owner]
        }
        
        const result = await this._pool.query(query);
        

        return  new AddedThread({...result.rows[0]})

    }

    async getThreadById(id){
        const query = {
            text:'SELECT id, title, owner FROM threads WHERE id = $1',
            values:[id]
        };
        const result = await this._pool.query(query);

        if(!result.rowCount){
            throw new InvariantError('thread tidak ditemukan');
             
        }        
        return  new AddedThread({...result.rows[0]})


    }

    async deleteThread(id){
        const is_deleted = true;
        const query = {
            text:'UPDATE threads SET is_deleted=$2 WHERE id = $1 RETURNING id',
            values:[id, is_deleted]
        };
        const result = await this._pool.query(query);

        if(!result.rowCount){
            throw new InvariantError('thread tidak ditemukan');             
        }        
        return result.rows[0]

    }

    async verifyThreadAvailability(id){
        const query = {
            text:'SELECT * FROM threads WHERE id = $1',
            values:[id]
        };
        const result = await this._pool.query(query);

        if(!result.rowCount){
            throw new InvariantError('thread tidak ditemukan');     
        }        

    }


}

module.exports = ThreadRepositoryPostgres;