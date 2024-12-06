class LikesComment {
  constructor(payload) {
    this._verifypayload(payload);
    const { threadId, commentId, owner } = payload;
    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifypayload({ threadId, commentId, owner }) {
    if (!threadId || !commentId || !owner) {
      throw new Error('LIKES_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new Error('LIKES_COMMENT.NOT_MEET_DATA_SPESIFICATION');
    }
  }
}

module.exports = LikesComment;
