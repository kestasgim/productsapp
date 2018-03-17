import faker from 'faker';

var nItems = 55;

var products = [];
var orders = [];

var categories = ["Discounts", "Luxury", "Favourite", "Free Style"];

for (var i = 0; i < nItems ; i++) { 

	var randomCategory = faker.random.number({min: 0, max:3});
	var randomProduct = faker.random.number({min: 0, max:nItems-1});

    products.push( {id: i, name: faker.commerce.productName(), category: categories[randomCategory], price: faker.commerce.price()} );
    orders.push( {id: i, productId: randomProduct, time: faker.date.between('2018-01-01', '2018-02-18'), price: faker.commerce.price()} );
}

export {products};
export {orders};
export {categories};
