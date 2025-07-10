
      module.exports = {
        method: 'GET',
        url: '/ts-test',
        handler: async (request, reply) => {
          return { message: 'typescript test' };
        }
      };
    