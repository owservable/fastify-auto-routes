
      class NoAsControllerAction {
        async routes() {
          return {
            method: 'GET',
            url: '/no-ascontroller',
            handler: async (request, reply) => {
              return { message: 'no-ascontroller' };
            }
          };
        }
        // Missing asController method
      }
      
      module.exports = { default: NoAsControllerAction };
    