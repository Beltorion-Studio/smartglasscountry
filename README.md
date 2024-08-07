# Custom codes for smartglasscountry.com by Beltrorion Studio


### Acknowledgements

This project is based on [Original Starter Template](https://github.com/finsweet/developer-starter), created by [Original Author](https://github.com/finsweet). We are grateful for their work and contributions to the open-source community.

You can edit the code using any code editor. I recommend using [Visual Studio Code](https://code.visualstudio.com/) or [Sublime Text](https://www.sublimetext.com/).

## How to use the code
You need to have [Node.js](https://nodejs.org/en/) installed on your computer.
You also need to have [pnpm](https://pnpm.io/) package manager installed on your computer.

To install the dependencies, you need to run the following command:
pnpm install 
This will install all the dependencies for the project.

To build the project, you need to run the following command:
pnpm run build and it will bundle the files for the different pages and put them in the dist folder. From there you can copy the code to the Webflow pages.

The code has two main parts:
Frontend:
This is what controls the functionalities of the different pages. 

The most important files are:
src folder:
- calculator.js for the Calculator page
- form.js for the Contact Form page
- product-details.js for the Product detail page
- dashboard.js for the Dashboard page
- login.js for the Login page
- order-success.js for the Order Success page

Settings folder:
- Global settings file:
  there are the urls for the different pages and the different endpoints for the API.
- statesOfCanada and statesOfUSA are the files that contain the states of Canada and the states of the USA. This is neccessary for the form page. It is used to populate the dropdowns for the states.

- Components folder:
Here are the different components that are used in the different pages. They are the main building blocks of the application.
- models folder:
They are mainly for development purposes. They are used to define the different objects. There is also a contactFormScema file that is used to validate the form.
- utils and services folder:
They contain the different helper functions that are used in different parts of the application.

The other files are mainly for development purposes.

Backend:
This is the part what is running on the Cloudflare server. It is written in Typescript and uses the Cloudflare Workers and Hono framework.

To run the project locally, you need to run the following command:
pnpm run dev

If you had any modification you can deploy the project to the Cloudflare server, with the following command:
pnpm run deploy

The main part of the code is in the src folder.
- The workers file controls the different routes and the different endpoints.

- routes folder:
It contains the different routes for the different pages. They are the main building blocks of the application.
The webhook route is used to handle the webhooks from the Stripe API if the order was successfull. It is used to send the order confirmation email to the customer.
- models folder:
They are mainly for development purposes. They are used to define the different objects. There is also a contactFormScema file that is used to validate the form on the server side. It is similar to the one in the frontend.
- services folder:
They contain the different helper functions that are used in different parts of the application.
- services/ mailingSercices folder:
It is containing the functions that are used to send the emails and creat the different templates. To edit the templates you need to edit the ts files. The html files are only for reference.
- db folder:
It is containing the structure of the database. It is used to store the different orders and the different users. To change it's structure is not recommended and it is not straightforward.

- wrangler.toml file:
It is the configuration file for the Cloudflare Workers. It is used to configure the project. What you mingt want to chage there is 
crons = ["* */6 * * *"]
This is used to run the cron job every 6 hours for sending the reminder emails. So curently it is checking every 6 hours if there is any deposit order that is not paid yet. If there is any, it will send a reminder email to the customer.

This also can be changed in the Cloudflare dashboard.


