const corsOptions = {
  origin: ["http://localhost:3001", process.env.CLIENT_URL, "*"], // remove * for production
  credentials: true,
};

export { corsOptions };
