const LikesCommentRepository = require('../../Domains/likesComment/LikesCommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class LikesCommentRepositoryPostgres extends LikesCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLikeComment(addLike) {
    const id = `like-${this._idGenerator()}`;
    const { threadId, commentId, owner } = addLike;
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, threadId, commentId, owner],
    };
    const result = await this._pool.query(query);

    return result;
  }

  async likeComment(commentId, userId) {
    const query = {
      text: 'UPDATE comment_likes SET is_deleted = false WHERE comment_id=$1 AND user_id=$2',
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }

  async unlikeComment(commentId, userId) {
    const query = {
      text: 'UPDATE comment_likes SET is_deleted = true WHERE comment_id=$1 AND user_id = $2',
      values: [commentId, userId],
    };
    await this._pool.query(query);
  }

  async getLikeCountByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(*) FROM comment_likes WHERE comment_id = $1 AND is_deleted = false',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    const likes = parseInt(result.rows[0].count, 10);

    return likes;
  }

  async getLikesCommentStatus(commentId, userId) {
    const query = {
      text: 'SELECT is_deleted FROM comment_likes WHERE comment_id = $1 AND user_id= $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async verifyLikedCommentAvaibility(commentId, userId) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment_id= $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return false;
    }
    return true;
  }
}

module.exports = LikesCommentRepositoryPostgres;
