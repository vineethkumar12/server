const bodyParser = require('body-parser')
const express =require('express') 
const cors =require('cors') 
const bcrypt=require('bcrypt')
const app = express()   
 app.use(express.json())
 app.use(cors())
const database= {
  users:
  [{
    id: "123",
    name:"vineeth",
    email:"adepuvineethkumarvinni@gmail.com",
    password:"vineeth",
    entries:"0",
    joined:new Date()
 
   },{
 
     id: "124",
     name:"vinay",
     email:"vinay@gmail.com",
     password:"vinay",
     entries:"0",
     joined:new Date()
  
 
 
 
 
 
   }], login:[
   { id:"987" ,
    hash:"",
    email:"adepuvineethkumarvinni@gmail.com"
  
  
  
  
  }
  ]
} 
app.get("/signin",(req,res)=>{ 
    const {email,password}=req.body 
   
 bcrypt.compare("vini", '$2b$10$gQxiwOOh3SuNeRcpD9iUd..XVBNpbOha6TPtE0/5IHhbhW9H21YFW', function(err, result) {
  console.log("same"+result)
});
bcrypt.compare('vinnih','$2b$10$gQxiwOOh3SuNeRcpD9iUd..XVBNpbOha6TPtE0/5IHhbhW9H21YFW', function(err, result) {
  // result == false 
  console.log(" not same"+result) 
 
});  
    //var a=false
//database.users.filter((user,i)=>{ 
      
  //if(password === user.password && email === user.email)
  //{     a = true
    return  res.json(database.users)
  //} 
   
 
   
//} )   
//if (!a) 
//   return res.json(database.users)
   
  


}) 
    
 app.post("/register",(req,res)=>{ 
    const {email,password,name}=req.body 
    
   
     database.users.push(
        {
            id: "125",
            name:name,
            email:email,
            password:password,
            entries:"0",
            joined:new Date()
         
           }  
           

     ) 
     bcrypt.genSalt( function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
          // Store hash in your password DB. 
          console.log(hash)
      });
  });
        res.json(database.users[database.users.length-1])
        
        }) 
        app.get("/profile/:id",(req,res)=>{ 
        const {id}= req.params 
        var  newdata=false
           database.users.filter(item=>{ 
              if(item.id=== id) 
             {    newdata=true; 
               
                return  res.json(item) ;}
             
             } )  
             if( !newdata) 
             { res.json(" id is not valid")} 
            })   
            app.put("/image",(req,res)=>{ 
                const {id}= req.body  
                var  newdata=false
             database.users.filter(item=>{ 
              if(item.id=== id) 
              {    newdata=true; 
                        var a=item.entries++
                        return  res.json(a) ;}
                     
              } )  
                     if( !newdata) 
                     { res.json(" id is not valid")} 
                    })   


    
     app.get("/",(req,res)=>{
     res.send(database.users) }) 

    // bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
      // Store hash in your password DB.
  //}); 
  // Load hash from your password DB.
//bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
  // result == true
//});
//bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
  // result == false
//});

    

app.listen(5000,()=> console.log("server is running"))