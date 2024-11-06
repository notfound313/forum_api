class AddThread {    
    constructor(payload){
        this._verifyPayload(payload);
        const {title, content } = payload
        this.title = title;
        this.content = content;
    }

    _verifyPayload({title, content}){

        if(!title || !content){
            throw new Error('USER_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
            
        }

        if(typeof title !== 'string' || typeof content !== 'string'){
                    throw new Error('USER_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
        
       
    }
}

module.exports = AddThread