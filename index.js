// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });

// Declare a route
fastify.get("/*", { prefix: "/api" }, async (request, reply) => {
  let endpoints = [
    {
      topShows: "/api/shows/top?page={pagenum}",
      popularShows: "/api/shows/popular?page={pagenum}",
      newestShows: "/api/shows/newest?page={pagenum}",
      upcomingShows: "/api/shows/upcoming?page={pagenum}",
      varietyShows: "/api/shows/variety?page={pagenum}",
    },
    {
      topMovies: "/api/movies/top?page={pagenum}",
      popularMovies: "/api/movies/popular?page={pagenum}",
      newestMovies: "/api/movies/newest?page={pagenum}",
      upcomingMovies: "/api/movies/upcoming?page={pagenum}",
    },
  ];
  return { info: "Welcome to Mydramalist.com API", endpoints: endpoints };
});

// Import Routes
const scrape = require("./scrape");

// Register Routes
fastify.register(scrape, { prefix: "/api" });

// Run the server!
const start = async () => {
  try {
    await fastify.listen(5001);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
