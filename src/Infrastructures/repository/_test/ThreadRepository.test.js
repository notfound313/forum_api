const ThreadTableHelpTest = require('../../../../tests/ThreadTableHelpTest');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const pool = require('../../database/postgres/pool');


describe('ThreadRepositoryPostgres', ()=>{
    afterEach(async()=>{
        await ThreadTableHelpTest.cleanTable()
    })
    afterAll(async () => {
        await pool.end();
    })


    describe('addThread function', () => {
        it('should add thread to database and return thread user correctly', async ()=> {
            //Arrange         
            const addThread = new AddThread({
                title:'ini title',
                content:'content'
            });
            const addedThread = {...addThread, owner:'user-123'}

            const fakeGenerator = ()=> '123'
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool,fakeGenerator);            

            //action
            await threadRepositoryPostgres.addThread(addedThread)

            //assert
            const users = await ThreadTableHelpTest.findThreadById('thread-123');
            expect(users).toHaveLength(1);
        });      

        it('should return Thread correctly', async ()=> {
            //arrange
            const addThread = new AddThread({
                title:'title-thread',
                content:'conten-thearead',
            });
            const threadPayload = {...addThread, owner:'user-123'};
            const fakeGenerator = ()=> '123'
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool,fakeGenerator)

            //action
            const addedThread =  await threadRepositoryPostgres.addThread(threadPayload);

            expect(addedThread).toStrictEqual(new AddedThread({
                id:'thread-123',
                title:addThread.title,
                owner:threadPayload.owner
            }));

        });


    });

    describe('getThreadById function', ()=> {
        it('should throw error invariant when thread not found', async () => {
            //arrange 
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool,{});
            
            //action and assert
            return expect(threadRepositoryPostgres.getThreadById('thread-123'))
            .rejects
            .toThrowError(InvariantError);        
        })

        it('should return thread correctly when id is exist', async () => {
            //arrange
            await ThreadTableHelpTest.addThread({
                id:'thread-123',
                title:'hello',
                owner:'user-123'
            });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
            //action
            const addedThread = await threadRepositoryPostgres.getThreadById('thread-123');

            //assert
            expect(addedThread).toStrictEqual(new AddedThread({
                id:'thread-123',
                title:'hello',
                owner:'user-123'
            }))

        })
    });

    describe('deleteThread function', ()=> {
        it('should throw error invariant when thread not found', async () => {
            //arrange 
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool,{});
            
            //action and assert
            return expect(threadRepositoryPostgres.deleteThread('thread-123'))
            .rejects
            .toThrowError(InvariantError);        
        });

        it('should return id when thread succes to deleted', async ()=> {
            //arrange
            await ThreadTableHelpTest.addThread({
                id:'thread-123',
                title:'hello',                
                owner:'user-123'
            });    
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool,{})      

            //action 
            const deleteThread = await threadRepositoryPostgres.deleteThread('thread-123')
            
            // assert
            expect(deleteThread).toEqual({id:'thread-123'})
        });
    });

    describe('verifyThreadAvailability fucntion', () => {
        
        it('should throw error invariant when thread not found', async () => {
            //arrange                   
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool,{});

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyThreadAvailability('user-123'))
            .rejects
            .toThrowError(InvariantError);
        });

        it('should not throw InvariantError when username available', async () => {
            // Arrange
            await ThreadTableHelpTest.addThread({
                id:'thread-123',
                title:'hello',                
                owner:'user-123'
            });  
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      
            // Action & Assert
            await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-123'))
            .resolves
            .not.toThrowError(InvariantError);
          });
    })
    
})