const AddThread = require('../AddThread');

describe('a AddThreads entities', ()=>{
    it('should throw error when payload not contain properly', ()=> {
        //arrange
        const payload = {
            content : 'hello world'
        }
        //assert and action

        expect(()=> new AddThread(payload)).toThrowError('USER_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');

    })
    it('should throw error when payload did not meet data type specification', () => {
            // Arrange
            const payload = {
                title: 123,
                content: true
            };
    
            // Action and Assert
            expect(() => new AddThread(payload)).toThrowError('USER_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        });
    
        it('should create AddThread object correctly', () => {
            // Arrange
            const payload = {
                title: 'thread title',
                content: 'thread content'
            };
    
            // Action
            const addThread = new AddThread(payload);
    
            // Assert
            expect(addThread.title).toEqual(payload.title);
            expect(addThread.content).toEqual(payload.content);
        });
    
})