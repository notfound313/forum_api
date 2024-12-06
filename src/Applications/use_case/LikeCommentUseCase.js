const LikesComment = require('../../Domains/likesComment/entities/LikesComment');

class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likesCommentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likesCommentRepository = likesCommentRepository;
  }

  async execute(useCasePayload) {
    const likeComment = new LikesComment(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(likeComment.threadId);
    await this._commentRepository.verifyCommentAvailability(likeComment.commentId);
    const checkAvailabilityLike = await this._likesCommentRepository
      .verifyLikedCommentAvaibility(likeComment.commentId, likeComment.owner);

    if (!checkAvailabilityLike) {
      await this._likesCommentRepository.addLikeComment(likeComment);
    } else {
      const statusLike = await this._likesCommentRepository
        .getLikesCommentStatus(likeComment.commentId, likeComment.owner);
      if (statusLike.is_deleted) {
        await this._likesCommentRepository.likeComment(likeComment.commentId, likeComment.owner);
      } else {
        await this._likesCommentRepository.unlikeComment(likeComment.commentId, likeComment.owner);
      }
    }
  }
}

module.exports = LikeCommentUseCase;
