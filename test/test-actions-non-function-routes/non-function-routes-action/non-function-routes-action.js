
      class NonFunctionRoutesAction {
        routes = 'not a function';
        
        async asController() {
          return true;
        }
      }
      
      module.exports = { default: NonFunctionRoutesAction };
    