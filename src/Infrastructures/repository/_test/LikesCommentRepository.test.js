const LikesCommentRepositoryPostgres = require('../LikesCommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LikesCommentTestHelper = require('../../../../tests/LikesCommentTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('LikesCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesCommentTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLikeComment function', () => {
    it('should persist like comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const fakeIdGenerator = () => '123';
      const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likesCommentRepositoryPostgres.addLikeComment({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      // Assert
      const likes = await LikesCommentTestHelper.findLikeCommentById('comment-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('verifyLikedCommentAvaibility function', () => {
    it('should return true if like is available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await LikesCommentTestHelper.addLikeComment({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(likesCommentRepositoryPostgres.verifyLikedCommentAvaibility('comment-123', 'user-123'))
        .resolves.toEqual(true);
    });

    it('should return false if like is not available', async () => {
      // Arrange
      const likesCommentRepository = new LikesCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(likesCommentRepository.verifyLikedCommentAvaibility('comment-123', 'user-123'))
        .resolves.toEqual(false);
    });
  });

  describe('unlikeComment function', () => {
    it('should unliike correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await LikesCommentTestHelper.addLikeComment({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(pool, {});

      // Action
      await likesCommentRepositoryPostgres.unlikeComment('comment-123', 'user-123');

      // Assert
      const likes = await LikesCommentTestHelper.findLikeCommentById('comment-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('getLikeCountByCommentId function', () => {
    it('should return like count correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await LikesCommentTestHelper.addLikeComment({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(pool, {});

      // Action
      const likeCount = await likesCommentRepositoryPostgres.getLikeCountByCommentId('comment-123');

      // Assert
      expect(likeCount).toEqual(1);
    });
  });
});
