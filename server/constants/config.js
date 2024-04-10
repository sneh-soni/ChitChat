const corsOptions = {
  origin: ["http://localhost:3001", process.env.CLIENT_URL],
  credentials: true,
};

export { corsOptions };
