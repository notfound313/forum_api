const LikeComment = require('../LikesComment')

describe('a LikesComment entities ', ()=> {
    it('should throw error when payload not contain properly', ()=> {
        // Arrange
        const payload = {
            threadId:'thread-123',
            commentId:'comment-123',        
        }

        // Action & Assert
        expect(()=> new LikeComment(payload)).toThrowError('LIKES_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');        
    })
})
