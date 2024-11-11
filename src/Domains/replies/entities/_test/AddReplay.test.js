const AddReply = require('../AddReply');

describe('a AddReply entities ', () => {
  it('should throw error when payload not contain properly', () => {
    // arrange
    const payload = {
      content: 'hello world',
    };
    // assert and action

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'sebuah replay',
      threadId: true,
      commentId: 'coment-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create object AddReply correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah replay',
      threadId: 'thread-123',
      commentId: 'coment-123',
      owner: 'user-123',
    };

    // Action
    const addReply = new AddReply(payload);

    // Assert
    expect(addReply).toBeInstanceOf(AddReply);
    expect(addReply.content).toEqual(payload.content);
    expect(addReply.threadId).toEqual(payload.threadId);
    expect(addReply.commentId).toEqual(payload.commentId);
    expect(addReply.owner).toEqual(payload.owner);
  });
});
