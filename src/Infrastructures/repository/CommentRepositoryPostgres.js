  const NotFoundError = require('../../Commons/exceptions/NotFoundError');
  const CommentRepository = require('../../Domains/comments/CommentRepository');
  const AddedComment = require('../../Domains/comments/entities/AddedComment');
  

  class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
      super();
      this._pool = pool;
      this._idGenerator = idGenerator;
    }

    async addComment(newComment) {
      const { content, owner, threadId } = newComment;
      const id = `comment-${this._idGenerator()}`;     
      

      const query = {
        text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
        values: [id, threadId,content, owner],
      };

      const result = await this._pool.query(query);
      return new AddedComment({...result.rows[0]});
    }

    async verifyCommentOwner(commentId, owner) {
      const query = {
        text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
        values: [commentId, owner],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new NotFoundError('komentar tidak ditemukan');
      }
    }

    async deleteComment(commentId) {
      const query = {
        text: 'UPDATE comments SET is_delete = true WHERE id = $1',
        values: [commentId],
      };

      await this._pool.query(query);
    }

    async getCommentsByThreadId(threadId) {
      const query = {
        text: `SELECT comments.id, users.username, comments.created_at AS date, comments.content, comments.is_delete
              FROM comments 
              INNER JOIN users ON comments.owner = users.id
              WHERE comments.thread_id = $1
              ORDER BY date ASC`,
        values: [threadId],
      };

      const result = await this._pool.query(query);
      return result.rows;
    }

    async verifyAvailableComment(commentId) {
      const query = {
        text: 'SELECT * FROM comments WHERE id = $1',
        values: [commentId],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new NotFoundError('komentar tidak ditemukan');
      }
    }
  }

  module.exports = CommentRepositoryPostgres;
