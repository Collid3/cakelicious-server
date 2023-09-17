const alllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3000/signin",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (alllowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Access denied by cors"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
