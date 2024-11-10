const AddReplyUseCase = require('../AddReplyUseCase');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const comments = require('../../../Interfaces/http/api/comments');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah replay',
      threadId: 'thread-123',
      commentId: 'coment-123',
      owner: 'user-123',
    };

    // Action
    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));

    expect(mockThreadRepository.verifyThreadAvailability)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability)
      .toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      commentId: useCasePayload.commentId,
      threadId: useCasePayload.threadId,
    }));
  });
});
