
      class NoRoutesAction {
        // Missing routes method
        async asController() {
          return true;
        }
      }
      
      module.exports = { default: NoRoutesAction };
    