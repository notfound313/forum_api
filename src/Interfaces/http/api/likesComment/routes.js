const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.putLikeCommentHandler,
    options: {
      auth: 'forumapp_jwt',
    },
  },
]);

module.exports = routes;
