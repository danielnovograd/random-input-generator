module.exports = {
  fnRunner: function(testingFunction, ...args) {
    return () => {
      for (var i = 0; i < 1000; i++) {
        try {
          let response = testingFunction.apply(null, args);
          if (typeof response === "object" &&
              response.name && response.message
              && Object.keys(response).length === 0) {
            throw new Error(response.message)
          }
        }
        catch(e) {
          throw new Error(e);
        }
      };
    }
  }
};