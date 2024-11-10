const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ commentRepository, replyRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    await this._commentRepository.verifyCommentAvailability(addReply.commentId);
    await this._threadRepository.verifyThreadAvailability(addReply.threadId);

    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
