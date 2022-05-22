var express = require('express');
var router = express.Router();
const users = require("../usersData");
const methods = require("../methods");
const createCsvWriter = requiree('csv-writer').createCsvWriter;



const registerPage="../views/users/register";
const loginPage="../views/users/login";

//path
const csvWriter = createCsvWriter({
  path: 'datos.csv',
  header:[
    {id:'name', title:'Name'},
    {id:'email', title:'Email'},
    {id:'password', title:'password'},


  ]
});

//enviar el csv
csvWriter
.writeRecords(users.data)
.then(()=>console.log('The csv file wass written'));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/home', function(req,res){
  res.render('home');
})
router.get('/login', function(req,res){
  res.render(loginPage);
})
router.get('/register', function(req,res){
  res.render(registerPage);
})

router.post('/register',(req,res)=>{
  const {fullName, email, password, confirmPassword} = req.body

  if(password === confirmPassword){
      if(users.data.find(u=> u.email===email)){
        res.render(registerPage,{
          message:"El usuario ya esta registrado",
          messageClass: "alert-danger"
        })
      }

      const phash = methods.getHashedPassword(password);
      //almacenar los datos
      users.data.push({
        fullName,
        email,
        password: phash
      });

      


      res.render(loginPage,{
        message:"Registro Completo. Inicie sesion",
        messageClass: "alert-sucess"
      })
  }else{
    res.render(registerPage,{
      message:"Las contraseñas no coinciden",
      messageClass: "alert-danger"
    })

  }

})


router.post('/login', (req,res)=>{
  const {email, password} =req.body;
  const hashedPassword = methods.getHashedPassword(password);

  //validar los datos

  const dataUser = users.data.find(u=>{
    return u.email === email && hashedPassword === u.password;
  });

  if(dataUser){
    const authToken = methods.generateToken();
    //almacenar token de autenticacion
    methods.authTokens[authToken]=dataUser;
    res.cookie('AuthToken', authToken);
    res.redirect('/home');
  }else{
    res.render(loginPage,{
      message:"Usuario o clave no coiciden",
      messageClass: "alert-danger"
    })
  }
})
module.exports = router;
