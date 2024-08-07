# Custom Application for Smartglasscountry.com by Beltrorion Studio

### Acknowledgements

This project is based on the [Original Starter Template](https://github.com/finsweet/developer-starter), created by [Original Author](https://github.com/finsweet). We are grateful for their work and contributions to the open-source community.

You can edit the code using any code editor. We recommend using [Visual Studio Code](https://code.visualstudio.com/) or [Sublime Text](https://www.sublimetext.com/).

## How to Use the Code

You need to have [Node.js](https://nodejs.org/en/) installed on your computer, along with the [pnpm](https://pnpm.io/) package manager.

### Install Dependencies

Run the following command to install all the dependencies for the project:

```bash
pnpm install
```
You need to install the dependencies in the `root` folder the `frontend` and `backend` folder.
### Build the Project

To build the project and bundle the files for the different pages, run:

```bash
pnpm run build
```

The bundled files will be placed in the `dist` folder. You can copy the code from there to the Webflow pages.

### Code Structure

The code has two main parts:

### Frontend

This controls the functionalities of the different pages.

**Important Files:**

- **src Folder:**
  - `calculator.js`: For the Calculator page
  - `form.js`: For the Contact Form page
  - `product-details.js`: For the Product Detail page
  - `dashboard.js`: For the Dashboard page
  - `login.js`: For the Login page
  - `order-success.js`: For the Order Success page

- **Settings Folder:**
  - **Global Settings File:** Contains the URLs for the different pages and endpoints for the API.
  - **statesOfCanada.js** and **statesOfUSA.js**: Contain the states of Canada and the USA, used to populate dropdowns on the form page.

- **Components Folder:**
  - Contains different components used across the pages, serving as the main building blocks of the application.

- **Models Folder:**
  - Mainly for development purposes, defining different objects. Also includes `contactFormSchema.js` for form validation.

- **Utils and Services Folders:**
  - Contain helper functions used in various parts of the application.

### Backend

This part runs on the Cloudflare server, written in TypeScript and using Cloudflare Workers and the Hono framework.

**Running the Project Locally:**

Run the following command:

```bash
pnpm run dev
```

**Deploying the Project:**

If you've made any modifications, deploy the project to the Cloudflare server with:

```bash
pnpm run deploy
```

### Backend Code Structure

- **src Folder:**
  - **Workers File:** Controls different routes and endpoints.

- **Routes Folder:**
  - Contains routes for different pages, serving as the main building blocks of the application.
  - **Webhook Route:** Handles webhooks from the Stripe API when an order is successful, sending order confirmation emails to customers.

- **Models Folder:**
  - Defines different objects for development purposes. Includes `contactFormSchema.js` for server-side form validation, similar to the frontend version.

- **Services Folder:**
  - Contains helper functions used across the application.
  - **Mailing Services Folder:** Functions for sending emails and creating templates. Edit the `.ts` files to modify templates; the `.html` files are for reference only.

- **DB Folder:**
  - Contains the structure of the database, storing orders and users. Changing its structure is not recommended and is not straightforward.

- **wrangler.toml File:**
  - Configuration file for Cloudflare Workers. One setting you might want to change is:

    ```toml
    crons = ["* */6 * * *"]
    ```

    This runs a cron job every 6 hours to send reminder emails for unpaid deposit orders. This setting can also be changed in the Cloudflare dashboard.