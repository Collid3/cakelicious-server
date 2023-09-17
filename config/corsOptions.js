const alllowedOrigins = ["https://cakelicious-server.onrender.com"];

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
