const info = (...parms) => {
  console.log(...parms);
};

const error = (...parms) => {
  console.error(...parms);
};

module.exports = {
  info,
  error,
};
