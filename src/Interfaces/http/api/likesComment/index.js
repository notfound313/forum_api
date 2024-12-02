const routes = require('./routes');
const LikesCommentHandler = require('./handler');

module.exports = {
  name: 'likesComment',
  register: async (server, { container }) => {
    const likesCommentHandler = new LikesCommentHandler(container);
    server.route(routes(likesCommentHandler));
  },
};
