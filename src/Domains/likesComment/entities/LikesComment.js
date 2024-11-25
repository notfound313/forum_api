class LikesComment {
  constructor(payload) {
    this._verifypayload(payload);
    const { threadId, commentId, userId } = payload;
    this.threadId = threadId;
    this.commentId = commentId;
    this.userId = userId;
  }

  _verifypayload({ threadId, commentId, userId }) {
    if (!threadId || !commentId || !userId) {
      throw new Error('LIKES_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof userId !== 'string') {
      throw new Error('LIKES_COMMENT.NOT_MEET_DATA_SPESIFICATION');
    }
  }
}

module.exports = LikesComment;
