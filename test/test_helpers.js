module.exports = {
  fnRunner: function(testingFunction, ...args) {
    return () => {
      for (var i = 0; i < 1000; i++) {
        try {
          let response = testingFunction.apply(this, args);
          if (typeof response === "object" ) {
            throw Error(response.message)
          }
        }
        catch(e) {
          throw new Error(e);
        }
      };
    }
  }
};