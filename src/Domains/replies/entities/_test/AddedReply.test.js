const AddedReply = require('../AddedReply');

describe('a AddedReply entities', () => {
  it('should throw error when payload not contain properly', () => {
    // Arrange
    const payload = {
      content: 'hello worlds',
    };
    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'hello worlds',
      owner: true,
    };
    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create object AddReply correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'constent haha',
      owner: 'user-123',
    };

    // Action
    const addedReply = new AddedReply(payload);

    // Assert
    expect(addedReply).toBeInstanceOf(AddedReply);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
