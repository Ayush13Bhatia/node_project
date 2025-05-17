const sequelize = require('./database/db.js');
const { DataTypes } = require("sequelize");
const express = require("express");
const app = express();
const e = require("express");
app.use(express.json());






const User = require("./model/user_model.js")(sequelize, DataTypes);

const Address = require("./model/address_model.js")(sequelize, DataTypes);
const Product = require("./model/product_model.js")(sequelize, DataTypes);
User.hasMany(Address, { foreignKey: "user_id", as: "address" });
Address.belongsTo(User, { foreignKey: "user_id" });

// User has many products
User.hasMany(Product, { foreignKey: "user_id", as: "products" });
Product.belongsTo(User, { foreignKey: "user_id" });

const router = require('./routes/product_routes.js');

const cartRouter = require('./cart/route/cart_route.js');

app.use(router);
app.use(cartRouter);

app.get(["/getUsers", "/getUsers/:id"], async (req, res) => {
  try {
    const userId = req.params.id;
    const whereCluase = {};

    if (userId) {
      whereCluase.user_id = userId;
    }

    const userData = await User.findAll({
      where: whereCluase,
      include: {
        model: Address,
        as: "address",
      },
    }); // Fetch all users

    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (e) {
    console.error("Error executing query", e);


    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: e.toString(),
    });
  }
});

app.post("/pgPost", async (req, res) => {
  const create_date = new Date().toISOString();

  try {
    const { user } = req.body;

    const existing_user_email = await User.findOne({
      where: { user_email: user.user_email },
    });
    console.log("existing_user_email", existing_user_email);
    if (existing_user_email) {
      return res.json({
        success: false,
        message: "Email Already Exists",
      });
    }

    // Step 1: Create user
    const createUser = await User.create({
      user_name: user.user_name,
      user_email: user.user_email,
      password: user.password,
      created_date: create_date,
      dob: user.dob,
    });

    // Step 2: Create address using user.address

    var address_insertion = [];

    for (let addr of user.address) {
      address_insertion.push({
        user_id: createUser.user_id,
        city_id: addr.city_id,
        state_id: addr.state_id,
        country_id: addr.country_id,
        address_1: addr.address_1,
        address_2: addr.address_2,
      });
    }
    user_address = await Address.bulkCreate(address_insertion, {
      returning: true,
    });

    res.status(201).json({
      message: "User Created Successfully",
      user: createUser.user_id,
      // user: {
      //   user_id: createUser.user_id,
      //   user_name: user.user_name + createUser.user_id,
      //   user_email: user.user_email,
      //   password: user.password,
      //   created_date: create_date,
      //   dob: user.dob,
      //   address: user_address.map((adr)=> ({
      //     address_id: adr.address_id,
      //     city_id: adr.city_id,
      //     state_id: adr.state_id,
      //     country_id: adr.country_id,
      //     address_1: adr.address_1,
      //     address_2: adr.address_2

      //   }))
      // }
    });
  } catch (e) {
    console.error("Error creating user and address:", e);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the user.",
      error: e.toString(),
    });
  }
});

app.post("/updatePost", async (req, res) => {
  try {
    const { user } = req.body;

    if (!user || !user.user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required"
      })
    }

    const existing_user = await User.findOne({
      where: { user_id: user.user_id },
      include: { model: Address, as: 'address' },
    });


    if (!existing_user) {
      return res.json({
        success: false,
        message: "User does't exists"
      })
    }

    existing_user.user_name = user.user_name ?? existing_user.user_name;
    existing_user.dob = user.dob ?? existing_user.dob;
    await existing_user.save();



    // if (user.address.address_id) {
    console.log('user.address.address_id', user.address[0].address_id);

    // }

    for (const adrData of user.address) {
      const { address_id } = adrData;

      if (!address_id) {
        console.warn(`Missing address_id in one of the address objects`);
        continue;
      }
      const existing_address = await Address.findOne({
        where: {
          address_id: address_id,
          user_id: user.user_id
        }
      })

      if (!existing_address) {
        console.warn(`Address with ID ${address_id} not found for user ${user.user_id}`);
        continue;
      }

      // ✅ Update fields only if they're provided
      existing_address.address_1 = adrData.address_1 ?? existing_address.address_1;
      existing_address.address_2 = adrData.address_2 ?? existing_address.address_2;
      existing_address.city_id = adrData.city_id ?? existing_address.city_id;
      existing_address.state_id = adrData.state_id ?? existing_address.state_id;
      existing_address.country_id = adrData.country_id ?? existing_address.country_id;

      await existing_address.save();



    }


    return res.json({
      success: true,
      message: "Update successfully",
      user: existing_user,
    });
  } catch (e) {
    res.json({
      success: false,
      message: e.message,

    });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});



app.get('/products', async (req, res) => {
  try {
    const product = await Product.findAll();

    return res.json({
      success: true,
      product: product,
    })
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get products',
      error: e.message
    })
  }
})