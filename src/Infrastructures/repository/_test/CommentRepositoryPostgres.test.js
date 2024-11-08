const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      
      const addComment = new AddComment({
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      }));
      expect(comment).toBeDefined();
    });

    it('should reject add comment with incorrect data type', async () => {
          // Arrange
          await UsersTableTestHelper.addUser({ id: 'user-123' });
          await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
          
          const addComment = new AddComment({
            content: 123, 
            threadId: 'thread-123',
            owner: 'user-123',
          });
          const fakeIdGenerator = () => '123';
          const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
    
          // Action & Assert
          await expect(commentRepositoryPostgres.addComment(addComment))
            .rejects
            .toThrowError(InvariantError);
        });
    
        it('should reject add comment with missing required property', async () => {
          // Arrange
          await UsersTableTestHelper.addUser({ id: 'user-123' });
          await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
          
          const addComment = new AddComment({
            content: 'sebuah comment',           
            owner: 'user-123',
          });
          const fakeIdGenerator = () => '123';
          const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
    
          // Action & Assert
          await expect(commentRepositoryPostgres.addComment(addComment))
            .rejects
            .toThrowError(InvariantError);
        });
    
  });

  describe('getCommentById function', () => {
      it('should return comment by id correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          content: 'sebuah comment',
          threadId: 'thread-123',
          owner: 'user-123',
        });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
  
        // Action
        const comment = await commentRepositoryPostgres.getCommentById('comment-123');
  
        // Assert
        expect(comment).toStrictEqual({
          id: 'comment-123',
          content: 'sebuah comment',
          thread_id: 'thread-123',
          owner: 'user-123',
          is_delete: false,
          date: expect.any(String),
        });
      });
  
      it('should throw NotFoundError when comment not found', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
  
        // Action & Assert
        await expect(commentRepositoryPostgres.getCommentById('comment-123'))
          .rejects
          .toThrowError(NotFoundError);
      });
    });
  
    describe('verifyCommentAvailability function', () => {
      it('should not throw NotFoundError when comment exists', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          content: 'sebuah comment',
          threadId: 'thread-123',
          owner: 'user-123',
        });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
  
        // Action & Assert
        await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123'))
          .resolves.not.toThrowError(NotFoundError);
      });
  
      it('should throw NotFoundError when comment does not exist', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
  
        // Action & Assert
        await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123'))
          .rejects
          .toThrowError(NotFoundError);
      });
    });
    describe('deleteComment function', () => {
          it('should delete comment from database', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({
              id: 'comment-123',
              content: 'sebuah comment',
              threadId: 'thread-123',
              owner: 'user-123',
            });
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
    
            // Action
            await commentRepositoryPostgres.deleteComment('comment-123');
    
            // Assert
            const comment = await CommentsTableTestHelper.findCommentsById('comment-123');
            expect(comment).toHaveLength(1);
            expect(comment[0].is_delete).toEqual(true);
          });
    
          it('should throw NotFoundError when comment not found', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
    
            // Action & Assert
            await expect(commentRepositoryPostgres.deleteComment('comment-123'))
              .rejects
              .toThrowError(NotFoundError);
          });
        });
    
  
});