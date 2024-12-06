/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesCommentTableTestHelper = {
  async addLikeComment({
    id = 'like-123',
    threadId = 'thread-123',
    commentId = 'comment-123',
    owner = 'user-123',

  }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3, $4)',
      values: [id, threadId, commentId, owner],
    };

    await pool.query(query);
  },
  async findLikeCommentById(commentId) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_likes WHERE 1=1');
  },

};

module.exports = LikesCommentTableTestHelper;
