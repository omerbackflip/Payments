//    When a client sends request for an endpoint using HTTP request (GET, POST, PUT, DELETE), we need to determine how the server will reponse by setting up the routes.

//    These are our routes:

//    /api/projects: GET, POST, DELETE
//    /api/projects/:id: GET, PUT, DELETE
//    /api/projects/published: GET


module.exports = app => {
  const projects = require("../controllers/project.controller.js");

  var router = require("express").Router();

  // Create a new Project
  router.post("/", projects.create);

  // Retrieve all Projects
  router.get("/", projects.findAll);

  // Retrieve all published Projects
  router.get("/published", projects.findAllPublished);

  // Retrieve a single Project with id
  router.get("/:id", projects.findOne);

  // Update a Project with id
  router.put("/:id", projects.update);

  // Delete a Project with id
  router.delete("/:id", projects.delete);

  // Delete all Projects
  router.delete("/", projects.deleteAll);

  app.use('/api/projects', router);
};