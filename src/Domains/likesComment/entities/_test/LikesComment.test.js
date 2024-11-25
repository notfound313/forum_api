const LikesComment = require('../LikesComment');

describe('a LikesComment entities ', () => {
  it('should throw error when payload not contain properly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // Action & Assert
    expect(() => new LikesComment(payload)).toThrowError('LIKES_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did meet data spesification', () => {
    // Arrange
    const payload = {
      threadId: {},
      commentId: true,
      userId: 'user-123',
    };

    // Action & Assert
    expect(() => new LikesComment(payload)).toThrowError('LIKES_COMMENT.NOT_MEET_DATA_SPESIFICATION');
  });
  it('should create object AddReply correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    // Action
    const likeComment = new LikesComment(payload);

    // Assert
    expect(likeComment).toBeInstanceOf(LikesComment);
    expect(likeComment.threadId).toEqual(payload.threadId);
    expect(likeComment.commentId).toEqual(payload.commentId);
    expect(likeComment.userId).toEqual(payload.userId);
  });
});
