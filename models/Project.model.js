const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const projectSchema = new Schema({
  title: {
    type:String,
    minlength: [2,"All Projects need to have minimum 2 characters for title"],
    unique:true
  },
  description: String,
  rating:{
    type:Number,
    min:[1,"RATING NEEDS TO BE ABOVE 1"],
    max:[5,"MAX RATING IS 5"]
  },
  tasks: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Task' // Reference to the Task model
    }],
    validate: [
      {
        validator: function(arr) {
          console.log(arr.length)
          return arr.length <= 8;
        },
        message: 'Tasks array cannot have more than 8 items'
      }
    ]
  },
  image:{
    type:String
  }

/* omar: {
  type: String,
  validate: {
    validator: function(value) {
      return value === "omar";
    },
    message: "Name must be 'omar'"
  }
}
 */  // owner will be added later on
});

module.exports = model("Project", projectSchema);