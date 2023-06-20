const db = require('./connection');
const { faker } = require('@faker-js/faker');
const { User, Service, Category } = require('../models');

db.once('open', async () => {
    await Category.deleteMany();

    const categories = await Category.insertMany([
        { name: 'Dog Care' },
        { name: 'Movers' },
        { name: 'Cleaning' },
        { name: 'Rennovations' },
        { name: 'Landscaping' }
    ]);

    console.log('categories seeded');

    await Service.deleteMany();
    const services = [];

    for (let i = 0; i < 20; i++) {
      const randomCategoryIndex = Math.floor(Math.random() * categories.length);
      const randomCategory = categories[randomCategoryIndex];
  
      const service = {
        name: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        category: randomCategory._id,
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
        ]
      };
  
        services.push(service);
    }
  
    const createdServices = await Service.insertMany(services);
  
    console.log(`${createdServices.length} services seeded`);

    await User.deleteMany();

    await User.create({
        username: 'Pamela',
        email: 'pamela@testmail.com',
        password: 'password12345',
    });

    await User.create({
        username: 'Elijah',
        email: 'eholt@testmail.com',
        password: 'password12345'
    });

    console.log('users seeded');

    process.exit();
});
