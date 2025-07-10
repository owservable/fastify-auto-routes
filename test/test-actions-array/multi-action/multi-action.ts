
      module.exports = {
        default: class MultiAction {
          async routes() {
            return [
              {
                method: 'GET',
                url: '/multi1',
                handler: async (request, reply) => {
                  return { message: 'multi1' };
                }
              },
              {
                method: 'POST',
                url: '/multi2',
                handler: async (request, reply) => {
                  return { message: 'multi2' };
                }
              }
            ];
          }
          
          async asController() {
            return true;
          }
        }
      };
    