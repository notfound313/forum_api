class LikesCommentRepository {
  async addLikeComment(threadId, commentId, userId) {
    throw new Error('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async unlikeComment(likesId, userId) {
    throw new Error('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getLikesCommentByThreadId(threadId) {
    throw new Error('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getLikesCommentById(commentId) {
    throw new Error('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyLikesCommentAvailability(likesId) {
    throw new Error('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyLikedComment(userId, commentId) {
    throw new Error('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async likeComment(likesId) {
    throw new Error('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikesCommentRepository;
