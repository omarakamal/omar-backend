const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Project = require("../models/Project.model");
const Task = require("../models/Task.model");

const fileUploader = require("../config/cloudinary.config");


//  POST /api/projects  -  Creates a new project
router.post("/projects", (req, res, next) => {
  const { title, description, rating ,imageUrl} = req.body;

  Project.create({ title, description, tasks: [],rating,image:imageUrl})
    .then((response) => res.json(response))
    .catch((err) => {
        next(err)
      }
    )
});

router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  // console.log"file is: ", req.file)
 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  
  res.json({ fileUrl: req.file.path });
});
 


router.get('/projects', async (req, res) => {
  try {
    let query = {};

    // Check if title query parameter is provided
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: 'i' };
    }

    // Check if rating query parameter is provided
    if (req.query.rating) {
      query.rating = { $gte: parseInt(req.query.rating) };
    }

    // Query MongoDB using Mongoose model with the constructed query
    const projects = await Project.find(query);

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





router.post('/projects/many',(req,res)=>{

  Project.insertMany(req.body)
  .then(()=>{
    res.json('success')
  })
})

router.get('/search', async (req, res) => {
  try {
    let query = {};

    // Check if title query parameter is provided
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: 'i' };
    }

    // Check if rating query parameter is provided
    if (req.query.rating) {
      query.rating = { $gte: parseInt(req.query.rating) };
    }

    // Query MongoDB using Mongoose model with the constructed query
    const projects = await Project.find(query);

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//  GET /api/projects -  Retrieves all of the projects
router.get("/projects", (req, res, next) => {
  Project.find()
    .populate("tasks")
    .then((allProjects) => res.json(allProjects))
    .catch((err) => res.json(err));
});

//  GET /api/projects/:projectId -  Retrieves a specific project by id
router.get("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Each Project document has `tasks` array holding `_id`s of Task documents
  // We use .populate() method to get swap the `_id`s for the actual Task documents
  Project.findById(projectId)
    .populate("tasks")
    .then((project) => res.status(200).json(project))
    .catch((error) => res.json(error));
});

// PUT  /api/projects/:projectId  -  Updates a specific project by id
router.put("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndUpdate(projectId, req.body, { new: true })
    .then((updatedProject) => res.json(updatedProject))
    .catch((error) => res.json(error));
});

// DELETE  /api/projects/:projectId  -  Deletes a specific project by id
router.delete("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndRemove(projectId)
    .then(() =>
      res.json({
        message: `Project with ${projectId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;