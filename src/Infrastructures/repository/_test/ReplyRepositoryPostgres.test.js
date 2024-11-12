const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const addReply = new AddReply({
        content: 'sebuah reply',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: addReply.content,
        owner: addReply.owner,
      }));
      expect(reply).toHaveLength(1);
    });
  });

  describe('getReplyById function', () => {
    it('should return reply by id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'sebuah reply',
        owner: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      // Action
      const reply = await replyRepositoryPostgres.getReplyById('reply-123');

      // Assert
      expect(reply).toStrictEqual({
        id: 'reply-123',
        content: 'sebuah reply',
        owner: 'user-123',
        date: expect.any(Date),
      });
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply from database and return id', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const reply = await replyRepositoryPostgres.deleteReply('reply-123');

      // Assert
      expect(reply.id).toEqual('reply-123');
      expect(reply.is_deleted).toEqual(true);
    });
  });

  describe('verifyReplyAvailability function', () => {
    it('should throw NotFoundError when id reply does not exists', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123'))
        .rejects
        .toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when reply is exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123'))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });
  });
  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when id and owner is exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', ''))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not AuthorizationError  when reply id  and owner exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'))
        .resolves
        .not
        .toThrowError(AuthorizationError);
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should return reply  by id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const thread = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');

      // Assert
      expect(thread).toStrictEqual(
        [
          {
            id: 'reply-123',
            comment_id: 'comment-123',
            username: 'dicoding',
            date: expect.any(Date),
            content: 'sebuah reply',
            is_deleted: false,
          },
        ],
      );
    });
  });
});
