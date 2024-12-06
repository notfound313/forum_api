class DetailThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likesCommentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likesCommentRepository = likesCommentRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadAvailability(useCasePayload.threadId);
    const detailThread = await this._threadRepository.getThreadById(useCasePayload.threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload.threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(useCasePayload.threadId);

    const thread = {
      ...detailThread,
      comments: await Promise.all(comments.map(async (comment) => {
        const likeComment = await this._likesCommentRepository.getLikeCountByCommentId(comment.id);
        return {
          id: comment.id,
          username: comment.username,
          date: comment.date,
          content: comment.is_deleted ? '**komentar telah dihapus**' : comment.content,
          likeCount: likeComment,
          replies: replies
            .filter((reply) => reply.comment_id === comment.id)
            .map((reply) => ({
              id: reply.id,
              username: reply.username,
              content: reply.is_deleted ? '**balasan telah dihapus**' : reply.content,
              date: reply.date,
            })),
        };
      })),

    };

    return thread;
  }
}

module.exports = DetailThreadUseCase;
