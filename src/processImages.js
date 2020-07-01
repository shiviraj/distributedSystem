const processImage = ({ count, width, height, tags }) => {
  return new Promise((resolve, reject) => {
    let a = 0;
    let b = 0;
    for (let i = 0; i < +count; i++) {
      for (let j = 0; j < +width; j++) {
        for (let k = 0; k < +height; k++) {
          a = b + 1;
          b = a * a;
        }
      }
    }
    const allTags = tags.split('_');
    resolve(allTags);
  });
};

module.exports = { processImage };
