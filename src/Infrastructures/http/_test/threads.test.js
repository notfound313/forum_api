const pool = require('../../../Infrastructures/database/postgres/pool');
const ThreadTableHelpTest = require('../../../../tests/ThreadTableHelpTest');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', ()=> {
    afterAll(async () => {
        await pool.end();
      });
    
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
      });

    describe('/')

})

