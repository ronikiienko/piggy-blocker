mv3-parcel-template
===================

Template for Chrome Extensions manifest v3.

Uses [@parcel/config-webextension](https://parceljs.org/recipes/web-extension/)

Usage
-----

```shell
npm i  # to install dependencies
npm start # run in dev mode
npm run build # to build production version
```

To add the extension to your browser, load Parcel's output folder unpacked. For example, in Chrome, click "Load
Unpacked" in the `chrome://extensions` page and select `path/to/project/dist`.