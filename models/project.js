const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  filename: String,
  timestamp: String
});

projectSchema.set('timestamps', true);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
