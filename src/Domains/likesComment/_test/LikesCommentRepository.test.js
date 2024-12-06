const LikesCommentRepository = require('../LikesCommentRepository');

describe('LikesCommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likesCommentRepository = new LikesCommentRepository();

    // Action and Assert
    await expect(likesCommentRepository.addLikeComment({})).rejects.toThrowError('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likesCommentRepository.verifyLikedCommentAvaibility('')).rejects.toThrowError('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likesCommentRepository.unlikeComment('')).rejects.toThrowError('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likesCommentRepository.getLikeCountByCommentId('')).rejects.toThrowError('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likesCommentRepository.getLikesCommentStatus('')).rejects.toThrowError('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likesCommentRepository.likeComment('')).rejects.toThrowError('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
