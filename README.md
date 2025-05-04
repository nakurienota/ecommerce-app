# 📦 Ecommerce Store

This online bookstore offers a vast collection of books across all genres, catering to every reader’s taste. Whether you’re looking for thrilling mysteries, insightful non-fiction, timeless classics, or the latest bestsellers, this platform provides an intuitive and user-friendly experience. It has a user-friendly interface, modern design and adaptability for any device with a minimum resolution of 390 px.

## 📖 Key pages in the application include:

- Login and Registration pages 🖥️
- Main page 🏠
- Catalog Books page 📋
- Detailed Book page 🔎
- User Profile page 👤
- Basket page 🛒
- About Us page 🙋‍♂️🙋‍♀️
  The application is powered by CommerceTools.

## 🌟Key Features

This online bookstore provides users with a modern and user-friendly interface to explore, purchase, and manage books effortlessly.  
[x] **Book Sales** – Convenient catalog, detailed descriptions and the ability to purchase online.  
[x] **Access to a wide range of titles** – Fiction, non-fiction, educational books, science fiction and more.  
[x] **Personalization** – user profile with purchase history and recommendations.  
[x] **Adaptability** – user-friendly interface for smartphones, tablets and computers.

## ⚡ Features

- Viewing the book catalog
- Searching for books by title and author
- Filtering by genre
- Adding books to the cart
- Checking out an order

## 🛠️ Technologies Used

- TypeScript
- Webpack
- ESLint + Prettier
- Stylelint
- Husky
- Jest

## The application is to be developed in teams:

**Mentor** - @Denis-Gusar  
**Team Lead** - @nakurienota  
**Frontend Developers** - @IvanK9, @Olga-Ter

## 🔧 Installation

1. Clone the repository:  
   git clone https://github.com/nakurienota/ecommerce-app.git

2. Install dependencies:
   `npm install`

3. Running the Project

###### For development: `npm run start`

###### Build: `npm run build`

###### Production: `npm run build:prod`

## ⚙️ Scripts

| Script          | Purpose                                                                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `format`        | runs Prettier to format the code by automatically applying consistent styling                                                             |
| `format:check`  | verifies whether the code is formatted according to Prettier rules                                                                        |
| `start`         | launches Webpack's development server                                                                                                     |
| `build`         | compiles the project using Webpack to generate the final production-ready files                                                           |
| `build:prod`    | compiles the project using Webpack in production mode                                                                                     |
| `lint`          | runs ESLint to analyze the code and enforce best practices by checking for errors and style issues                                        |
| `stylelint`     | executes Stylelint to verify CSS files for common formatting issues or errors                                                             |
| `stylelint:fix` | runs Stylelint with the --fix flag, automatically correcting styling mistakes in CSS files                                                |
| `test`          | runs tests with Jest: finds test files in the project ( .test.ts) and runs tests                                                          |
| `test:watch`    | run tests in watch mode: Jest will watch for changes in test and source files and automatically re-run tests if anything changes          |
| `test:coverage` | used to check code coverage by tests: generates a code coverage report, shows the percentage of coverage of functions, lines and branches |
| `deploy`        | builds the project using Webpack and deploys it to Netlify as a production-ready site                                                     |
| `prepare`       | automatically starts Husky installation when you `run npm install`                                                                        |

## 🐕 Git hooks:

`commit-msg`: is triggered when a commit message is created;\ `pre-commit`: runs before the commit is finalized. Automatically format code with Prettier or run linting to catch issues before committing;\
`pre-push`: executes before pushing to a remote repository, run tests before allowing a push.
