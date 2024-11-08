const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment content',
      };

      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { accessToken } = JSON.parse(loginResponse.payload).data;

      // add thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread title',
          body: 'thread body',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadId = JSON.parse(threadResponse.payload).data.addedThread.id;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(requestPayload.content);
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};

      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { accessToken } = JSON.parse(loginResponse.payload).data;

      // add thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread title',
          body: 'thread body',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadId = JSON.parse(threadResponse.payload).data.addedThread.id;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };

      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { accessToken } = JSON.parse(loginResponse.payload).data;

      // add thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread title',
          body: 'thread body',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadId = JSON.parse(threadResponse.payload).data.addedThread.id;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai');
    });

    it('should response 401 when request not contain access token', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment content',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment content',
      };

      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { accessToken } = JSON.parse(loginResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });
    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
      it('should response 200 and delete comment', async () => {
        // Arrange
        const server = await createServer(container)

        // add user
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'dicoding',
            password: 'secret',
            fullname: 'Dicoding Indonesia',
          },
        })

        // login user
        const loginResponse = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'dicoding',
            password: 'secret',
          },
        })

        const { accessToken } = JSON.parse(loginResponse.payload).data

        // add thread
        const threadResponse = await server.inject({
          method: 'POST',
          url: '/threads',
          payload: {
            title: 'thread title',
            body: 'thread body',
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const { id: threadId } = JSON.parse(threadResponse.payload).data.addedThread

        // add comment
        const commentResponse = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          payload: {
            content: 'comment content',
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const { id: commentId } = JSON.parse(commentResponse.payload).data.addedComment

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: `/threads/${threadId}/comments/${commentId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(200)
        expect(responseJson.status).toEqual('success')
      })

      it('should response 403 when user is not owner', async () => {
        // Arrange
        const server = await createServer(container)

        // add user 1
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'dicoding',
            password: 'secret',
            fullname: 'Dicoding Indonesia',
          },
        })

        // add user 2
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'johndoe',
            password: 'secret',
            fullname: 'John Doe',
          },
        })

        // login user 1
        const loginResponse1 = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'dicoding',
            password: 'secret',
          },
        })

        const { accessToken: accessToken1 } = JSON.parse(loginResponse1.payload).data

        // login user 2
        const loginResponse2 = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'johndoe',
            password: 'secret',
          },
        })

        const { accessToken: accessToken2 } = JSON.parse(loginResponse2.payload).data

        // add thread
        const threadResponse = await server.inject({
          method: 'POST',
          url: '/threads',
          payload: {
            title: 'thread title',
            body: 'thread body',
          },
          headers: {
            Authorization: `Bearer ${accessToken1}`,
          },
        })

        const { id: threadId } = JSON.parse(threadResponse.payload).data.addedThread

        // add comment
        const commentResponse = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          payload: {
            content: 'comment content',
          },
          headers: {
            Authorization: `Bearer ${accessToken1}`,
          },
        })

        const { id: commentId } = JSON.parse(commentResponse.payload).data.addedComment

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: `/threads/${threadId}/comments/${commentId}`,
          headers: {
            Authorization: `Bearer ${accessToken2}`,
          },
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(403)
        expect(responseJson.status).toEqual('fail')
        expect(responseJson.message).toEqual('Anda tidak berhak mengakses resource ini')
      })

      it('should response 404 when thread not found', async () => {
        // Arrange
        const server = await createServer(container)

        // add user
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'dicoding',
            password: 'secret',
            fullname: 'Dicoding Indonesia',
          },
        })

        // login user
        const loginResponse = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'dicoding',
            password: 'secret',
          },
        })

        const { accessToken } = JSON.parse(loginResponse.payload).data

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/xxx/comments/xxx',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(404)
        expect(responseJson.status).toEqual('fail')
        expect(responseJson.message).toEqual('thread tidak ditemukan')
      })

      it('should response 404 when comment not found', async () => {
        // Arrange
        const server = await createServer(container)

        // add user
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'dicoding',
            password: 'secret',
            fullname: 'Dicoding Indonesia',
          },
        })

        // login user
        const loginResponse = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'dicoding',
            password: 'secret',
          },
        })

        const { accessToken } = JSON.parse(loginResponse.payload).data

        // add thread
        const threadResponse = await server.inject({
          method: 'POST',
          url: '/threads',
          payload: {
            title: 'thread title',
            body: 'thread body',
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const { id: threadId } = JSON.parse(threadResponse.payload).data.addedThread

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: `/threads/${threadId}/comments/xxx`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(404)
        expect(responseJson.status).toEqual('fail')
        expect(responseJson.message).toEqual('komentar tidak ditemukan')
      })

      it('should response 401 when request missing authentication', async () => {
        // Arrange
        const server = await createServer(container)

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/xxx/comments/xxx',
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(401)
        expect(responseJson.error).toEqual('Unauthorized')
        expect(responseJson.message).toEqual('Missing authentication')
      })
    })
});
  

