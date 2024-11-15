const DetailThreadUseCase = require('../DetailThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('DetailThreadUseCase', () => {
  it('should orchestrating the detail thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          replies: [
            {
              id: 'reply-123',
              username: 'dicoding',
              date: '2021-08-08T07:22:33.555Z',
              content: 'apakabar reply',
            },
          ],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
      }));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          is_deleted: false,
        },
      ]));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(
        [
          {
            id: 'reply-123',
            comment_id: 'comment-123',
            username: 'dicoding',
            date: '2021-08-08T07:22:33.555Z',
            content: 'apakabar reply',
            is_deleted: false,
          },
        ],
      ));

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThread = await detailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(detailThread).toStrictEqual(expectedThread);
  });
  it('should orchestrating the detail thread action correctly when comment and replies deleted', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08T07:22:33.555Z',
          content: '**komentar telah dihapus**',
          replies: [
            {
              id: 'reply-123',
              username: 'dicoding',
              date: '2021-08-08T07:22:33.555Z',
              content: '**balasan telah dihapus**',
            },
          ],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(
        {
          id: 'thread-123',
          title: 'sebuah thread',
          body: 'sebuah body thread',
          date: '2021-08-08T07:19:09.775Z',
          username: 'dicoding',
        },
      ));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(
        [
          {
            id: 'comment-123',
            username: 'dicoding',
            date: '2021-08-08T07:22:33.555Z',
            content: 'apakabar',
            is_deleted: true,
          },
        ],
      ));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(
        [
          {
            id: 'reply-123',
            comment_id: 'comment-123',
            username: 'dicoding',
            date: '2021-08-08T07:22:33.555Z',
            content: 'apakabar reply',
            is_deleted: true,
          },
        ],
      ));

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThread = await detailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(detailThread).toStrictEqual(expectedThread);
  });
});
