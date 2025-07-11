
      class VerboseAction {
        async routes() {
          return {
            method: 'GET',
            url: '/verbose',
            handler: async (request, reply) => {
              return { message: 'verbose' };
            }
          };
        }
        
        async asController() {
          return true;
        }
      }
      
      module.exports = { default: VerboseAction };
    