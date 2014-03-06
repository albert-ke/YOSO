var models = require('../models');

exports.listAll = function(req, res) {
  //var email = req.user.email;
  //console.log(email);

  // query for the specific project and
  // call the following callback
  models.User
        .findOne({email: 'b@yahoo.com'})
        .exec(afterQuery);

  function afterQuery(err, user) {
    if(err) console.log(err);
    console.log(user);
    res.render('friends', user);
  }
}

// exports.addProject = function(req, res) {
//   var form_data = req.body;
//   console.log(form_data);

//   // make a new Project and save it to the DB
//   // YOU MUST send an OK response w/ res.send();
//   var newProject = new models.Project({
//       "title": form_data["project_title"],
//       "date": form_data["date"],
//       "summary": form_data["summary"],
//       "image": form_data["image_url"]
//   });

//   newProject.save(afterSaved);
//   res.send();

//   function afterSaved(err) {
//     if (err) {
//       console.log(err);
//       res.send(500);
//     }
//   }
// }

// exports.deleteProject = function(req, res) {
//   var projectID = req.params.id;

//   // find the project and remove it
//   // YOU MUST send an OK response w/ res.send();
//   models.Project
//         .find({"_id": projectID})
//         .remove()
//         .exec(afterRemoved);

//   res.send();

//   function afterRemoved(err) {
//     if (err) {
//       console.log(err);
//       res.send(500);
//     }
//   }
// }