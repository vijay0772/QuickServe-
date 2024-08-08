// all images imported from images directory
import product_01_image_01 from "../images/product_01.jpg";
import product_01_image_02 from "../images/product_01.1.jpg";
import product_01_image_03 from "../images/product_01.3.jpg";

import product_02_image_01 from "../images/product_2.1.jpg";
import product_02_image_02 from "../images/product_2.2.jpg";
import product_02_image_03 from "../images/product_2.3.jpg";

import product_03_image_01 from "../images/product_3.1.jpg";
import product_03_image_02 from "../images/product_3.2.jpg";
import product_03_image_03 from "../images/product_3.3.jpg";

import product_04_image_01 from "../images/product_4.1.jpg";
import product_04_image_02 from "../images/product_4.2.jpg";
import product_04_image_03 from "../images/product_4.3.png";

import product_05_image_01 from "../images/product_04.jpg";
import product_05_image_02 from "../images/product_08.jpg";
import product_05_image_03 from "../images/product_09.jpg";

import product_06_image_01 from "../images/bread(1).png";
import product_06_image_02 from "../images/bread(2).png";
import product_06_image_03 from "../images/bread(3).png";

const products = [
  {
    id: "01",
    title: "Chicken Burger",
    price: 24.0,
    image01: product_01_image_01,
    image02: product_01_image_02,
    image03: product_01_image_03,
    category: "Burger",
    desc: "Juicy grilled chicken patty topped with fresh lettuce, tomato, and our special sauce. A classic favorite for all burger lovers.",
  },
  {
    id: "02",
    title: "Vegetarian Pizza",
    price: 115.0,
    image01: product_02_image_01,
    image02: product_02_image_02,
    image03: product_02_image_03,
    category: "Pizza",
    desc: "A delightful mix of seasonal vegetables on a bed of homemade tomato sauce and mozzarella cheese, baked to perfection.",
  },
  {
    id: "03",
    title: "Double Cheese Margherita",
    price: 110.0,
    image01: product_03_image_01,
    image02: product_03_image_02,
    image03: product_03_image_03,
    category: "Pizza",
    desc: "Twice the cheese, twice the flavor. Our Double Cheese Margherita is a heavenly blend of two types of cheese on a classic Margherita base.",
  },
  {
    id: "04",
    title: "Mexican Green Wave",
    price: 110.0,
    image01: product_04_image_01,
    image02: product_04_image_02,
    image03: product_04_image_03,
    category: "Pizza",
    desc: "Spicy green peppers, onions, and jalapenos drizzled with Mexican herbs. Ideal for those who love a little heat.",
  },
  {
    id: "05",
    title: "Cheese Burger",
    price: 24.0,
    image01: product_05_image_01,
    image02: product_05_image_02,
    image03: product_05_image_03,
    category: "Burger",
    desc: "A melt-in-your-mouth burger with a thick layer of cheddar cheese enveloping a succulent beef patty, garnished with pickles and onions.",
  },
  {
    id: "06",
    title: "Royal Cheese Burger",
    price: 24.0,
    image01: product_01_image_01,
    image02: product_01_image_02,
    image03: product_01_image_03,
    category: "Burger",
    desc: "Fit for royalty, our Royal Cheese Burger comes with a double serving of cheese and beef, crowned with a golden brioche bun.",
  },
  {
    id: "07",
    title: "Seafood Pizza",
    price: 115.0,
    image01: product_02_image_02,
    image02: product_02_image_01,
    image03: product_02_image_03,
    category: "Pizza",
    desc: "Fresh prawns, calamari, and mussels, topped with a garlic herb sauce and mozzarella, making it a seafood lover’s dream.",
  },
  {
    id: "08",
    title: "Thin Cheese Pizza",
    price: 110.0,
    image01: product_03_image_02,
    image02: product_03_image_01,
    image03: product_03_image_03,
    category: "Pizza",
    desc: "Crispy thin crust pizza with a rich tomato base, layered with mozzarella cheese that stretches with every bite.",
  },
  {
    id: "09",
    title: "Pizza With Mushroom",
    price: 110.0,
    image01: product_04_image_02,
    image02: product_04_image_01,
    image03: product_04_image_03,
    category: "Pizza",
    desc: "Earthy mushrooms generously scattered over mozzarella and sprinkled with Italian seasonings. A minimalist pizza that’s big on flavor.",
  },
  {
    id: "10",
    title: "Classic Hamburger",
    price: 24.0,
    image01: product_05_image_02,
    image02: product_05_image_01,
    image03: product_05_image_03,
    category: "Burger",
    desc: "Our classic hamburger offers a perfectly grilled beef patty accompanied by lettuce, tomato, and our secret sauce all enclosed in a toasted sesame bun.",
  },
  {
    id: "11",
    title: "Crunchy Bread",
    price: 35.0,
    image01: product_06_image_01,
    image02: product_06_image_02,
    image03: product_06_image_03,
    category: "Bread",
    desc: "Freshly baked bread with a crunchy crust and soft, fluffy inside. Perfect for your next meal or a treat on its own.",
  },
  {
    id: "12",
    title: "Delicious Bread",
    price: 35.0,
    image01: product_06_image_02,
    image02: product_06_image_01,
    image03: product_06_image_03,
    category: "Bread",
    desc: "Enjoy our delicious bread, baked daily with the finest ingredients. Its buttery flavor and soft texture make it impossible to resist.",
  },
  {
    id: "13",
    title: "Loaf Bread",
    price: 35.0,
    image01: product_06_image_03,
    image02: product_06_image_02,
    image03: product_06_image_03,
    category: "Bread",
    desc: "Traditional loaf bread with a golden crust and tender crumb, ideal for sandwiches or toasted with your favorite spread.",
  },
];


export default products;
