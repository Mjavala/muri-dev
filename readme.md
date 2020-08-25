

# MURI Live
-   [User Interface](https://irisslive.net/muri_live/#/)

# Build & Dev Environment
-   Install node.js
-   run ``npm install``
-   run ``npm run dev`` for local dev server (hot reload, vscode recommended)
-   run ``npm run build`` generates dist folder for production

# Directory Structure
-   public: index.html, here you'll find CDN link to the paho mqtt library
-   src/components/pages: all pages html, css and js code
-   src/components/router: vue routing logic between pages
-   src/plugins: external libraries (vuetify)
-   src/App.vue: entry point, defers to router views
-   main.js: vue instance entry point, global libs are instantiated here
-   babel.config.js: transpiler default settings
-   package.json: npm dependencies

### Stack

-   [Vue](https://vuejs.org/v2/guide/)
-   [Vuetify](https://vuetifyjs.com/en/getting-started/quick-start/)
-   [Plotly.js](https://plotly.com/javascript/)
-   [Vue-Leaflet](https://vue2-leaflet.netlify.app/)
-   [Vue-Apollo](https://apollo.vuejs.org/)
-   [GraphQL](https://graphql.org/)