
      class ArrayAction {
        async routes() {
          return [
            {
              method: 'GET',
              url: '/array1',
              handler: async (request, reply) => {
                return { message: 'array1' };
              }
            },
            {
              method: 'POST',
              url: '/array2',
              handler: async (request, reply) => {
                return { message: 'array2' };
              }
            }
          ];
        }
        
        async asController() {
          return true;
        }
      }
      
      module.exports = { default: ArrayAction };
    