const ThreadTableHelpTest = require('../../../../tests/ThreadTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableHelpTest.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add thread to database and return thread user correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      const addThread = new AddThread({
        title: 'ini title',
        body: 'body',
        owner: 'user-123',
      });

      const fakeGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeGenerator);

      // action
      await threadRepositoryPostgres.addThread(addThread);

      // assert
      const thread = await ThreadTableHelpTest.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return Thread correctly', async () => {
      // arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      const addThread = new AddThread({
        title: 'ini title',
        body: 'body',
        owner: 'user-123',
      });
      const fakeGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeGenerator);

      // action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: addThread.title,
          owner: addThread.owner,
        }),
      );
    });
  });

  describe('getThreadById function', () => {
    it('should return thread correctly when id is exist', async () => {
      // arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadTableHelpTest.addThread({
        id: 'thread-123',
        title: 'hello',
        owner: 'user-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      // action
      const addedThread = await threadRepositoryPostgres.getThreadById('thread-123');

      // assert
      expect(addedThread).toStrictEqual({
        id: 'thread-123',
        title: 'hello',
        body: 'ini konten',
        date: expect.any(Date),
        username: 'dicoding',
      });
    });
  });

  describe('deleteThread function', () => {
    it('should return id when thread succes to deleted', async () => {
      // arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadTableHelpTest.addThread({
        id: 'thread-123',
        title: 'hello',
        owner: 'user-123',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // action
      const deleteThread = await threadRepositoryPostgres.deleteThread('thread-123');

      // assert
      expect(deleteThread).toEqual({ id: 'thread-123' });
    });
  });

  describe('verifyThreadAvailability fucntion', () => {
    it('should throw error NotFoundError when thread not found', async () => {
      // arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability('user-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadTableHelpTest.addThread({
        id: 'thread-123',
        title: 'hello',
        owner: 'user-123',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });
});
