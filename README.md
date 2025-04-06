# Intelligent Pizza Ordering Platform - Frontend

## Overview

This repository contains the frontend web application for the Intelligent Pizza Ordering Platform. It is built using JavaScript with the React framework and interacts with the Django backend via REST API calls. The frontend provides the user interface for Browse the menu, placing orders, managing preferences, and utilizing the intelligent quick-ordering features.

**Technology Stack:**
* JavaScript
* React 
* Axios 

## Features

* **User Interface:** Provides components for all user interactions.
    * Login/Registration Screen
    * Menu Browse (Pizzas, Drinks, Sides)
    * Standard Ordering Process (Cart, Checkout)
    * Intelligent Quick Ordering Screen (with AI-driven and Rule-Based options)
    * User Preferences Management
    * Order History / Status Tracking
* **API Interaction:** Communicates with the backend REST API to fetch data and perform actions (e.g., place orders, get recommendations).
* **State Management:** Manages application state (e.g., user session, cart contents, menu data). (May use Context API, Redux, Zustand, etc.)
* **Responsive Design:** (Assumed) Adapts to different screen sizes.

## Interaction with Backend

The frontend is responsible for the presentation layer. It makes asynchronous requests to the backend API to:

* Authenticate users.
* Fetch menu data.
* Submit orders.
* Retrieve order history and status.
* Get personalized pizza recommendations for the quick ordering feature.
* Fetch and update user preferences.

All business logic and data persistence are handled by the backend server.

### How to Run the Application:

Backend (Django):
After cloning the repository, open the pizza-delivery-backend folder in your preferred code environment.
Ensure you have Python installed and all required libraries by running.
Start the server by running this command in the terminal:
python manage.py runserver
Leave the terminal window open as the backend must keep running.

Frontend (React):
After cloning the repository, open the pizza-delivery-frontend folder in a code environment.
Ensure you have Node.js installed. If not, download it here: Node.js.
In the terminal, run the command:
npm run dev
Follow the link provided in the terminal to access the app in your browser.

Explore the App:
Take some time to explore all the functionalities of the app. Once you’ve tried both the classic and quick ordering methods, and completed the tasks above, please close the app and answer the following questions.

GitHub Links:
Backend Repository: https://github.com/Mihai-Solescu/pizza-delivery-backend
Frontend Repository: https://github.com/Mihai-Solescu/pizza-delivery-frontend

Create an Account:
Go to the registration page and create an account.
Please use the format firstname_lastname as your username and firstname_lastname@gmail.com as your email to ensure your account details are unique.
You can fill out the other fields however you like.

Set Your Preferences:
After registering, fill out your pizza preferences to help tailor your experience.

Order Pizzas (Classic Method):
Explore the normal ordering menu and place your pizza order. Maybe rate some pizzas as well. Used in updating preferences.

Log In Again:
Log out, then access the login page and log back in using your account.
Try Quick Ordering:

Navigate to the quick ordering section and follow the tasks below.

There exists a ready-made account with admin privileges in the database with credentials:
username: mihai
password: 1234


### Non-AI version task instructions:
Login:
Log into your account using the credentials you created.
Access the Quick Order Page:

Navigate to the Quick Order section of the app.

Go through Quick Ordering (for non-AI version):
Make sure the top-left corner circle is green. If it's not, click it to switch to the non-AI version.
Press the pizza button.
Answer the questionnaire to generate your pizza order.

Confirm Your Order:
After selecting your pizza (in either version), confirm your order to complete the task.



### AI version task instructions:
Pre-requirements:
User has submitted the initial preferences questionnaire.

Login:
Log into your account using the credentials you created.

Access the Quick Order Page:
Navigate to the Quick Order section of the app.

Go through Quick Ordering (for the AI Version):
(Assuming user has already set preferences, else do so
Make sure the top-left corner circle is blue. If it's not, click it to switch to the AI version.
Pick your preferred pizza order from the options provided

Confirm Your Order:
After selecting your pizza (in either version), confirm your order to complete the task.
