const LikeCommentUseCase = require('../LikeCommentUseCase');
const LikesCommentRepository = require('../../../Domains/likesComment/LikesCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeCommentRepository = new LikesCommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeCommentRepository.verifyLikedCommentAvaibility = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeCommentRepository.addLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likesCommentRepository: mockLikeCommentRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeCommentRepository.verifyLikedCommentAvaibility)
      .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeCommentRepository.addLikeComment)
      .toHaveBeenCalledWith(useCasePayload);
  });

  it('should orchestrating the unlike comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeCommentRepository = new LikesCommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeCommentRepository.verifyLikedCommentAvaibility = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeCommentRepository.getLikesCommentStatus = jest.fn()
      .mockImplementation(() => Promise.resolve({
        is_deleted: false,
      }));
    mockLikeCommentRepository.unlikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likesCommentRepository: mockLikeCommentRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeCommentRepository.verifyLikedCommentAvaibility)
      .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeCommentRepository.getLikesCommentStatus)
      .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeCommentRepository.unlikeComment)
      .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
  });

  it('should orchestrating the re-like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeCommentRepository = new LikesCommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeCommentRepository.verifyLikedCommentAvaibility = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeCommentRepository.getLikesCommentStatus = jest.fn()
      .mockImplementation(() => Promise.resolve({
        is_deleted: true,
      }));
    mockLikeCommentRepository.getLikesCommentStatus = jest.fn()
      .mockImplementation(() => Promise.resolve({
        is_deleted: true,
      }));
    mockLikeCommentRepository.likeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likesCommentRepository: mockLikeCommentRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeCommentRepository.verifyLikedCommentAvaibility)
      .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeCommentRepository.getLikesCommentStatus)
      .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeCommentRepository.likeComment)
      .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
  });
});
