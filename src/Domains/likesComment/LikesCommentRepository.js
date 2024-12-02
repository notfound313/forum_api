class LikesCommentRepository {
  async addLikeComment(threadId, commentId, owner) {
    throw new Error('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async unlikeComment(commentId, owner) {
    throw new Error('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getLikeCountByCommentId(commentId) {
    throw new Error('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getLikesCommentStatus(commentId, owner) {
    throw new Error('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyLikedCommentAvaibility(commentId, owner) {
    throw new Error('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async likeComment(commentId, owner) {
    throw new Error('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikesCommentRepository;
