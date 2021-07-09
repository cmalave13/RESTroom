const express = require('express');
const userController = require('../controllers/userController');
const cookieController = require('../controllers/cookieController');
const sessionController = require('../controllers/sessionController');
const bathroomController = require('../controllers/bathroomController');

const { getAppointments, createAppointment, getReservations } = require('../controllers/appointmentController');

const app = express();

app.post('/usersignup',
  userController.newUser,
  cookieController.setSSIDCookie,
  sessionController.startSession,
  (req, res) => {
    res.status(200).json(res.locals.user);
    // res.redirect('filepath')
  });

app.post('/hostsignup',
  userController.newHost,
  cookieController.setSSIDCookie,
  sessionController.startSession,
  (req, res) => {
    // res.send('user signup')
    res.status(200).json(res.locals.user);
  });

app.post('/userlogin',
// sessionController.isLoggedIn,
  userController.verifyUser,
  cookieController.setSSIDCookie,
  sessionController.startSession,
  (req, res) => {
    res.status(200).json(res.locals.user);
  });

app.post('/hostlogin',
// sessionController.isLoggedIn,
  userController.verifyHost,
  cookieController.setSSIDCookie,
  sessionController.startSession, (req, res) => {
    // res.send('user has signed in!')
    res.status(200).json(res.locals.user);
  });

app.post('/addbathroom',
  bathroomController.addBathroom,
  (req, res) => res.status(200).json(res.locals.bathroom));
// app.put('/addbathroompic',
// bathroomController.)

// app.put('/rateuser',
// userController.rateUser,
// (req, res) => {
//     res.send('rated')
// })

app.delete('/deleteBathroom',
  bathroomController.deleteBathroom,
  (req, res) => {
    res.status(200).json('bathroom deleted');
  });

app.get('/getbathrooms',
  bathroomController.getHostBathrooms,
  (req, res) => {
    // console.log(res.locals.bathrooms)
    res.status(200).send(res.locals.bathrooms);
  });

// app.post('/addbathroompic',
// bathroomController.addbathroompic,
// (req, res) => {
//     res.status(200).send(res.locals.bathroomPics)
// })

app.post('/getnearbathrooms', 
bathroomController.getNearBathrooms,
(req, res) => {
    res.status(200).send(res.locals.nearBathrooms)
}
)

app.post('/updatebathroom',
  bathroomController.updateBathroom,
  (req, res) => {
    res.status(200).json(res.locals.updatedBathroom);
  });

app.get('/appointments',
  getAppointments, (req, res) => {
    res.status(200).send(res.locals.getAppointments);
  });

app.get('/logout', (req, res) => {
  req.logOut();
  req.session.destroy((err) => {
    res.redirect('/');
  });
});
app.get('/usersappointments',
  getReservations, (req, res) => {
    res.status(200).send(res.locals.getReservations);
  });
app.use('*', (req, res) => {
  res.status(404).send('Page Not Found!');
});

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Caught unknown Middleware',
  };
  const errorObj = { ...defaultErr, ...err };
  console.log(errorObj);
  return res.status(500).send('Server Error');
});

module.exports = app;
