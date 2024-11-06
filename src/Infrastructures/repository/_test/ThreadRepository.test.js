const ThreadTableHelpTest = require('../../../../tests/ThreadTableHelpTest');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');

describe('ThreadRepositoryPostgres', ()=>{

    afterEach(async()=>{
        ThreadTableHelpTest.cleanTable()
    })
    afterAll(async () => {
        pool.end();
    })


    describe('')
    
})