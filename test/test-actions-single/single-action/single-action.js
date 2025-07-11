
      class SingleAction {
        async routes() {
          return {
            method: 'GET',
            url: '/single',
            handler: async (request, reply) => {
              return { message: 'single' };
            }
          };
        }
        
        async asController() {
          return true;
        }
      }
      
      module.exports = { default: SingleAction };
    