const express = require("express")
const mariadb = require("mariadb")
// const bodyParser = require("body-parser")
const cors = require("cors")
const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    password: "123",
    database: "amazon_class",
    connectionLimit: 5
});


  
const app = express()
app.use(express.json())
app.use(cors())
// app.use(bodyParser.json())

app.get('/products' , async (req , res) => {
    const conn =  await pool.getConnection();
    const data  = await conn.query("select * from products")
    conn.release();
    res.send({
        "data": data 
    })
})
app.post('/signup' , async (req , res) =>{
    const body = req.body
    console.log(body)

    const conn =  await pool.getConnection();
    const query = "insert into users(NAME , gmail , password) values " + "(" + "'" + body.name + "'" + ", " + "'"+ body.gmail + "'"+ ", " + "'" +body.password+ "'" + ")"
    console.log(query)
    const data  = await conn.query(query)
    conn.release();
    res.send({
        "issigned": "true"
    })
    // insert into users(NAME , gmail , password) values ('avinas', 'gugrefujerif', 'NaN24trgc')

})

app.post('/signin' , async (req , res) =>{
    const {gmail , password} = req.body
    const conn =  await pool.getConnection();
    const query = "select * from users where " + "gmail = " + "'" + gmail+"'" +  " AND " + "password = " + "'" + password+"'"
    const data  = await conn.query(query)
    conn.release();
    if(data.length != 0){
        res.send(
            {"issigned" : "true" , "id" : data[0].id}
        )
    }else{
        

        res.send(
            {"issigned" : "false"}
        )

    }

})

app.post('/getcart' , async (req , res) =>{

    // if am the person who actually signed up in amazon and looking for cart products for the user
    const {id} = req.body
    const conn =  await pool.getConnection();
    const data  = await conn.query("select * from cart_item where " + "user_id = " + id)
    conn.release();
    if(data.length != 0){
        res.send(
            {"cart_items" : data}
        )   
    }else{
        res.send(
            {"cart_items" : []}
        )

    }

})
app.post('/cart' , async (req , res) =>{

    // if am the person who actually signed up in amazon and looking for cart products for the user
    const {user , product} = req.body
    console.log(user , product)
    const conn =  await pool.getConnection();
    // //TypeError: Do not know how to serialize a BigInt
    // so we need to convert them to strings
    const query = "insert into cart_item(user_id , product_id) values " + "(" + user + ", " + product + ")"
    const data  = await conn.query(query)
    conn.release();
    res.send(
        {"cart_items" : "true"}
    )

})
app.post('/getoneproduct' , async (req , res) =>{
    const {id} = req.body
    const conn =  await pool.getConnection();
    const data  = await conn.query("select * from products where " + "id = " + id)
    conn.release();
    res.send(
        {"product" : data} 
    )
})
app.post('/removefromcart' , async (req , res) =>{
    const {user , product} = req.body
    const conn =  await pool.getConnection();
    const data  = await conn.query("delete from cart_item where " + "product_id = " + product + " and " + "user_id = " + user)
    conn.release();
    res.send(
        {"cart_items" : "true"}
    )
})
app.listen(3007)
// hands on
// add rating api 5 --> rating , each product by the user
// cart person will be able see the rating of the product given by the user
// frontend all rating by the do an average rating of the product put display in the frontend
// add future api for cart
// chatgpt --> learn what you are doing 



// backend + improve the code of backend + frontend
// frontend --> check the cart and the product
// frontend --> signup and signin


// -------------------------------------------------------------------------------------------------
// 1. add few feautures
// admin can add product
// admin can see all the products
// admin can see all the users
// admin can see all the orders
// admin can see all the ratings
// remove add delete update product
// remove add delete update user
// ------------------------------------------------------------------------------------------------------
// tommorows class
// 1. orders ---> adress with gmail ---> send the mail to the user(order id , product name , price , adress)
// ------------------------------------------------------------------------------------------------------------
// payment gateway
// 1. razorpay
// 2. paypal
// 3. stripe
// 4. paytm
// 5. billdesk
// 6. billmonk



// -----------------------------------------------------
// additional things 
// animations
// more styling
// more features
// ------------------------------------------------------------------------------------------------------------



