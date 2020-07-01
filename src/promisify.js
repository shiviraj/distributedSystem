const promisify = (funcName) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      funcName(...args, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  };
};

const promisifyAll = (Model, methods) => {
  methods.forEach((method) => {
    Model[method] = promisify(Model[method].bind(Model));
  });
};

module.exports = { promisify, promisifyAll };
