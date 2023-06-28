const db = require('./connection');
const { faker } = require('@faker-js/faker');
// const faker = require('@faker-js/faker');

// const faker = require('faker');
const { User, Service, Category, Booking, Purchase } = require('../models');

db.once('open', async () => {
  await Category.deleteMany();
  await Service.deleteMany();
  await User.deleteMany();
  await Booking.deleteMany();
  await Purchase.deleteMany();

  const categories = await Category.insertMany([
    { name: 'Dog Care' },
    { name: 'Landscaping' },
    { name: 'House Cleaning' },
    { name: 'Renovations' },
    { name: 'Web Development' },
    { name: 'Appliance Repair' },
    { name: 'Physical Therapy' },
    { name: 'Photography' }
  ]);

  console.log('Categories seeded');

  const bcrypt = require('bcrypt');
  const saltRounds = 10;
  
  const users = [
    {
      username: 'Pamela',
      email: 'pamela@testmail.com',
      password: await bcrypt.hash('password12345', saltRounds)
    },
    {
      username: 'Elijah',
      email: 'eholt@testmail.com',
      password: await bcrypt.hash('password12345', saltRounds)
    },
  ];
  
  const createdUsers = await User.insertMany(users);

  console.log('Users seeded');

  const services = [];

  for (let i = 0; i < 20; i++) {
    const randomCategoryIndex = Math.floor(Math.random() * categories.length);
    const randomCategory = categories[randomCategoryIndex];
    const randomUserIndex = Math.floor(Math.random() * createdUsers.length);
    const randomUser = createdUsers[randomUserIndex];

    const service = {
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      category: randomCategory._id,
      user: randomUser._id,
      options: [
        {
          title: faker.commerce.productName(),
          description: faker.lorem.sentence(),
          price: faker.commerce.price(0.99, 100)
        },
        {
          title: faker.commerce.productName(),
          description: faker.lorem.sentence(),
          price: faker.commerce.price(0.99, 100)
        }
      ],
      images: [
        { url: faker.image.imageUrl() },
        { url: faker.image.imageUrl() }
      ],
      location: {
        address: faker.address.streetAddress(), // Add the address field with a valid value
        type: 'Point',
        coordinates: [faker.address.longitude(), faker.address.latitude()]
      }
    };

    services.push(service);
  }

  const createdServices = await Service.insertMany(services);

  console.log(`${createdServices.length} services seeded`);


  const bookings = [];

  for (let user of createdUsers) {
    for (let service of createdServices) {
      const booking = {
        service: service._id,
        user: user._id,
        date: faker.date.future(),
        time: faker.date.between('00:00', '23:59').toLocaleTimeString(), 
        name: faker.commerce.productName(), 
        number: faker.datatype.uuid(), 
        description: faker.lorem.sentence(),
        status: 'pending'
      };
  
      bookings.push(booking);
    }
  }

const createdBookings = await Booking.insertMany(bookings);

console.log(`${createdBookings.length} bookings seeded`);

const purchases = [];

for (let user of createdUsers) {
  for (let service of createdServices) {
    const randomOptionIndex = Math.floor(Math.random() * service.options.length);
    const randomOption = service.options[randomOptionIndex];
    const randomQuantity = faker.datatype.number({ min: 1, max: 5 });
    const randomTotal = randomQuantity * randomOption.price;
    const randomDate = faker.date.future();
    const purchaseStatus = 'completed';

    const option = {
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price({ min: 10, max: 100 })
    };

    const purchase = {
      service: service._id,
      user: user._id,
      option: option,
      quantity: randomQuantity,
      total: randomTotal,
      date: randomDate,
      status: purchaseStatus,
    };

    purchases.push(purchase);
  }
}

const createdPurchases = await Purchase.insertMany(purchases);

console.log(`${createdPurchases.length} purchases seeded`);

process.exit();
});