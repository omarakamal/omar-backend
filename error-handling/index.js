module.exports = (app) => {
  app.use((req, res, next) => {
    // this middleware runs whenever requested page is not available
    res.status(404).json({ message: "This route does not exist" });
  });

  app.use((err, req, res, next) => {

    if(err === "juanError"){
      res.status(400).json({message:"ALL OUR PASSWORDS NEED TO INCLUDE THE NAME JUAN"})
      return
    }

    if(err.name==='ValidationError'){
      const colonIndex = err.message.indexOf(':');
      let trimmedMessage = err.message.substring(colonIndex + 1).trim()
  
  
        res.json({error:trimmedMessage})
        return
    }
   

    if (err.code === 11000) {
      res.status(400).json({ message: "title is already taken" })
      return
    }
    // whenever you call next(err), this middleware will handle the error
    // always logs the error
    console.error("ERROR", req.method, req.path, err);

    // only render if the error ocurred before sending the response
    if (!res.headersSent) {
      res
        .status(500)
        .json({
          message: "Internal server error. Check the server console",
        });
    }
  });
};
