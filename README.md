## GroceryHaul
In today's fast-paced world, deciding what to cook and finding the right ingredients can be a hassle for many individuals and families. This challenge is further compounded by the sheer number of recipe options available online, making it overwhelming to choose a meal and gather the necessary ingredients.

Traditionally, people might rely on cookbooks or recipe websites to plan their meals, but this process often requires multiple steps: selecting a recipe, writing down the ingredients, and then figuring out where to buy them. While some apps provide meal suggestions, they often lack the ability to streamline the entire process from meal selection to ingredient acquisition. This is where GroceryHaul comes into play. GroceryHaul simplifies meal planning by using Gemini, a smart system that determines the ingredients needed for your next meal and automatically routes you to the nearest store to purchase them.

From personal experience, we have found that the process of meal planning and grocery shopping can be time-consuming and tedious. It often leads to multiple trips to different stores or last-minute changes to the meal plan. GroceryHaul aims to alleviate these issues by providing a seamless experience that not only suggests meals but also ensures that you have easy access to all the ingredients, making meal preparation stress-free and efficient.asdf


## Prerequistes
Currently you'll need to clone the repo. Then run npx convex dev and then npm run start.

## What it does
GroceryHaul enables users to interact with a chatbot by typing in what they want to cook. The chatbot processes this input and determines the necessary ingredients and the stores where these ingredients can be purchased. The gathered data is then transported to Mapbox, allowing users to visualize the nearest locations to pick up their groceries. 

## How it works
On the left side, users can interact with the chatbot. Once the chatbot determines the grocery store that the user needs to go to, the grocery store data is sent to Mapbox, which will determine the best routes to get to the stores.

