import {createSlice} from '@reduxjs/toolkit'

const items = createSlice({
    name : 'items',
    initialState: {
        ids: [{title: '4 Piece Chicken McNuggets', oldPrice: 3.69, image : require('../assets/food6.png'), reviews : [{ user: 'Alice', rating: 4, comment: 'Tasty!', days: '5days ago' },{ user: 'Jacob Henderson', rating: 5, comment: "I stumbled upon Nerds Gummy Clusters, and oh boy, what a find! The blend of fruity and tangy nerds with the chewy gummy inside is a party in my mouth. The 5oz bag disappears way too quickly. Can't get enough!", days: '5days ago' },{ user: 'Alice', rating: 4, comment: 'Tasty!', days: '5days ago' }], category: 'food'},
        {title: 'Double Quarter Pounder with Cheese', oldPrice: 3.69, image : require('../assets/food1.png'), reviews : [], category: 'food'},
        {title: 'Sausage McMuffin® with Egg Meal', oldPrice: 3.69, image : require('../assets/food2.png'), reviews : [], category: 'food'},
        {title: '10 PC. Spicy Chicken Nuggets', oldPrice: 3.69, image : require('../assets/food3.png'), reviews : [], category: 'food'},
        {title: 'Asiago Ranch Classic Chicken Club', oldPrice: 3.69, image : require('../assets/food4.png'), reviews : [], category: 'food'},
        {title: 'Sour Cream and Chive Baked Potato', oldPrice: 3.69, image : require('../assets/food5.png'), reviews : [], category: 'food'},
        {title: 'Trolli Very Berry Sour Brite Crawlers Gummy Candy 5oz', oldPrice: 3.69, image : require('../assets/snacks1.png'), reviews : [], category: 'snacks'},
        {title: 'Hostess Donettes Chocolate Mini Donuts Bag 10.75oz', oldPrice: 3.69, image : require('../assets/snacks2.png'), reviews : [], category: 'snacks'},
        {title: 'Kit Kat Candy Bar King Size 3oz', oldPrice: 3.69, image : require('../assets/snacks3.png'), reviews : [], category: 'snacks'},
        {title: 'Basically, Sour Rainbow Bites 5oz', oldPrice: 3.69, image : require('../assets/snacks4.png'), reviews : [], category: 'snacks'},
        {title: 'Ferrero Rocher Hazelnut Chocolate Candy 1.3oz', oldPrice: 3.69, image : require('../assets/snacks5.png'), reviews : [], category: 'snacks'},
        {title: 'OREO Original Chocolate Sandwich Cookies 13.29oz $5.49', oldPrice: 3.69, image : require('../assets/snacks6.png'), reviews : [], category: 'snacks'},
        {title: 'White Claw Seltzer Flavor No. 3 Variety 12pk 12oz Can 5.0% ABV $22.99', oldPrice: 3.69, image : require('../assets/alcohol1.png'), reviews : [], category: 'alcohol'},
        {title: 'White Claw Surge Variety 12pk 12oz Can 8% ABV $22.99', oldPrice: 3.69, image : require('../assets/alcohol2.png'), reviews : [], category: 'alcohol'},
        {title: 'White Claw Seltzer Variety 12pk 12oz Can 5.0% ABV $22.99', oldPrice: 3.69, image : require('../assets/alcohol3.png'), reviews : [], category: 'alcohol'},
        {title: 'Dolce Vita Italy Sparkling Prosecco 750ml $39.49', oldPrice: 3.69, image : require('../assets/alcohol4.png'), reviews : [], category: 'alcohol'},
        {title: "Jack Daniel's & Coca-Cola 355ml Can 7% ABV", oldPrice: 3.69, image : require('../assets/alcohol5.png'), reviews : [], category: 'alcohol'},
        {title: 'Don Romeo Blanco Tequila 750ml (80 Proof)', oldPrice: 3.69, image : require('../assets/alcohol6.png'), reviews : [], category: 'alcohol'},
        {title: 'CELSIUS Peach Mango Green Tea, Essential', oldPrice: 3.69, image : require('../assets/drink1.png'), reviews : [], category: 'drink'},
        {title: 'GHOST® Energy Sour Patch Kids Blue Raspberry 16oz Can $2.99', oldPrice: 3.69, image : require('../assets/drink2.png'), reviews : [], category: 'drink'},
        {title: 'Mountain Valley Spring Water Sparkling Glass', oldPrice: 3.69, image : require('../assets/drink3.png'), reviews : [], category: 'drink'},
        {title: 'Tiger Eye Iced Coconut Latte 8.5oz', oldPrice: 3.69, image : require('../assets/drink4.png'), reviews : [], category: 'drink'},
        {title: "La Colombe Cold Brew Colombian Light Roast Coffee 42oz $8.59", oldPrice: 3.69, image : require('../assets/drink5.png'), reviews : [], category: 'drink'},
        {title: 'La Colombe Cold Brew Brazilian Medium Roast', oldPrice: 3.69, image : require('../assets/drink6.png'), reviews : [], category: 'drink'},
        {title: 'Basically, 4ct Large Roll Soft Toilet Paper $22.99', oldPrice: 3.69, image : require('../assets/home1.png'), reviews : [], category: 'home'},
        {title: 'Bounty Select-A-Size Paper Towels, Double Roll', oldPrice: 3.69, image : require('../assets/home2.png'), reviews : [], category: 'home'},
        {title: 'Gain Ultra Original Liquid Dish Soap 8oz', oldPrice: 3.69, image : require('../assets/home4.png'), reviews : [], category: 'home'},
        {title: 'Tide PODS Liquid Laundry Detergent Pacs Spring Meadow Scent 42ct $15.49', oldPrice: 3.69, image : require('../assets/home3.png'), reviews : [], category: 'home'},
        {title: "Febreze April Fresh Fabric Refreshener with Downy", oldPrice: 3.69, image : require('../assets/home5.png'), reviews : [], category: 'home'},
        {title: 'Tide Liquid Laundry Detergent Original Scent', oldPrice: 3.69, image : require('../assets/home6.png'), reviews : [], category: 'home'},
    ]
    },
    reducers: {
        addReview : (state, action) => { const index = state.ids.findIndex(item => item.title === action.payload.id.title);

            if (index !== -1) {
                state.ids[index].reviews.push(action.payload.id.reviews);
            }},
    }
})

export const addReview= items.actions.addReview
export default items.reducer