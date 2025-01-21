# Getting started

Create Vite Project
```
npm create vite@latest . -- --template react-ts
```

Next run:
```
npm install
```

# Install MUI

Install library
```
npm install @mui/material @emotion/react @emotion/styled
```

Install icons
```
npm install @mui/icons-material
```

# Access localhost website

Run the following:
```
npm run dev
```

Go to ***http://localhost:5173/*** in your browser to see website.




# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

# Setting up PostgreSQL (Windows):

- Download PostgreSQL Version 17.2 from https://www.postgresql.org/download/
- Make sure PostgreSQL Server, pgAdmin 4, and Command Line Tools are selected
- Once installed, launch pgAdmin and click "Add New Server"
- In the General tab "Name" box, type "aardvarklocal"
- In the Connection tab "Host name/address" box, type "localhost"
- In the Connection tab, set a password in the designated box. Keep the username as "postgres"
- Click save. The server should be registered in pgAdmin

## Loading data into PostgreSQL server:

- Download the "aardvarkdb.sql" file pinned in the developer channel in the discord
- Ensure you are connected to the PostgreSQL server in pgAdmin
- Expand the "aardvarklocal" > "Databases(1)" > "postgres" tree and click on postgres
- Click "Tools" on the top bar, and then "Query Tool"
- Click the folder button within the tool and load the script. The db should now be loaded in
