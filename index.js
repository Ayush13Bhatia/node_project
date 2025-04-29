const { Sequelize, DataTypes} = require('sequelize');
const express = require('express');
const app = express();
const blogs  = require('./blogs');
const user_model = require('./model/user_model.js');

app.use(express.json());



const sequelize = new Sequelize('postgres', 'postgres', '123', {
  host: 'localhost',
  port: 5431,
  dialect:'postgres', /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});
sequelize.authenticate().then(()=>console.log('Connection has been established successfully.') ).catch((error)=> console.error('Unable to connect to the database:', error));


const User = require('./model/user_model.js')(sequelize, DataTypes);

const Address = require('./model/address_model.js')(sequelize, DataTypes);
// const Address = require('Address')(sequelize, DataTypes);
// const Address = require('./model/address_model.js')(sequelize, DataTypes);


User.hasMany(Address, { foreignKey: 'user_id' });
Address.belongsTo(User, { foreignKey: 'user_id' });


// Sync models (optional, for dev purposes)
// sequelize.sync().then(() => {
//   console.log('Models synced');
// });


app.get('/getUsers', async (req, res) => {
  // try {
    const userData = await User.findAll(); // Fetch all users
    const address = await Address.findAll();

    res.status(200).json({
      success: true,
      data: userData,
    });

  // } catch (e) {
  //   console.error('Error executing query', e);``

  //   res.status(500).json({
  //     message: 'Internal Server Error',
  //     success: false,
  //     error: e.toString(),
  //   });
  // }
});



   
app.post('/pgPost', async (req, res) => {
  const create_date = new Date().toISOString();

  try {
    const { user } = req.body;

    // Step 1: Create user
    const createUser = await User.create({
      user_name: user.user_name,
      user_email: user.user_email,
      password: user.password,
      created_date: create_date,
      dob: user.dob
    });

    // Step 2: Create address using user.address
    const user_address = await Address.create({
      user_id: createUser.user_id,
      city_id: user.address.city_id,
      state_id: user.address.state_id,
      country_id: user.address.country_id,
      address_1: user.address.address_1,
      address_2: user.address.address_2
    });

    res.status(201).json({
      message: "User Created Successfully",
      user: {
        user_id: createUser.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        password: user.password,
        created_date: create_date,
        dob: user.dob,
        address: {
          user_id: createUser.user_id,
          address_id: user_address.address_id,
          city_id: user.address.city_id,
          state_id: user.address.state_id,
          country_id: user.address.country_id,
          address_1: user.address.address_1,
          address_2: user.address.address_2
        }
      }
    });

  } catch (e) {
    console.error("Error creating user and address:", e);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the user.",
      error: e.toString()
    });
  }
});





///Route
app.get('/',(req, res)=> {
    res.send('Hello world12');ho
})

app.get(['/blogs', '/blogs/:id'], (req, res)=>{
    console.log(req.params.id);
    const postId = req.params.id;
    console.log(postId);
    var filterData = postId ?  blogs.filter((e)=> e.id === parseInt(postId)) : blogs;
    console.log(postId); 
    res.json(filterData);
})

app.get('/bgs', (req, res) => {
    const postId = req.query.id; // this comes from ?id=2
    console.log('Query id:', postId);
    const filterData = postId
      ? blogs.filter((e) => e.id === parseInt(postId))
      : blogs;
  
    res.json(filterData);
  });
  


app.post('/register', (req, res) => {
    const { name, email } = req.body;
  
    if (!name || !email ) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    res.status(200).json({
      message: 'User registered successfully',
      success: true,
      data: { name, email }
    });
  });



app.listen(3000, () => {
    console.log("Server listening on port 3000")
})