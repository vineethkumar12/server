const bodyParser = require('body-parser')
const express =require('express') 
const cors =require('cors')  
const app = express()

const bcrypt=require('bcrypt')
const {knex}=require('knex')
const register=require('./register')
//const {Client} =require('pg')
const db=knex({
  client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'vinni@123#',
      database : 'facedatabase'
    }
   

})

/*const client =new Client({
  
 
      host : 'localhost',
      port:5432,
      user : 'postgres',
      password : 'vinni@123#',
      database : 'facedatabase'

  


})
client.connect();
client.query('select * from public.users', (err,result)=>{
   if(!err)
   {
    console.log(result.rows);
   }
   client.end();

})*/
//db.select('*').from('public.users').then(data=>console.log(data))
   
 app.use(express.json())
 app.use( cors({
  origin:'https://vineethkumar12.github.io',
}))
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
app.post("/signin",(req,res)=>{ 
    const {email,password}=req.body 
    db.select('email','password').from('login').where('email','=',email)
    .then(data=>{
     
      if(data[0].password===password)
        {return db.select('*').from('users').where('email','=',email)
        .then(user => res.json(user[0]))
        .catch(err=>res.status(400).json(err))
        
          
        }
        else {
          res.status(400).json('invalid user')
        }
    }).catch(err=>res.status(400).json(err))
  

   // return  res.json(database.users)
 

}) 
    
app.post("/register",(req,res)=>{register.handleregister(req,res,db)}) 
  
  




       
    
        
        
        

        app.get("/profile/:id",(req,res)=>{ 
        const {id}= req.params 
        var  newdata=false
           db.select('*').from('users').where({id})
           .then(user => res.json(user[0]))
           .catch(err=>res.status(400).json(err))
           
           /*if( !newdata) 
             { res.json(" id is not valid")} */
            }
            )  

           
            app.put("/image",(req,res)=>{ 
                const {id}= req.body  
                
                  db('users').where('id','=',id).increment('entries',1).returning('entries')
            .then(entries => {
              
              res.json(entries[0])
            })
            .catch(err=>res.status(400).json("unable to get entries"))})
              
    
     app.get("/",(req,res)=>{
     res.send(database.users) }) 


    

app.listen(5000,()=> console.log("server is running"))