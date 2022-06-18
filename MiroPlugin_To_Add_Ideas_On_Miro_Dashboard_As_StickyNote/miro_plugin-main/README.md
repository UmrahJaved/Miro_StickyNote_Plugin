![Tux, the Linux mascot](/assets/demo.gif)

# Context

KPMG Use-case: create Miro plugin that integrates GPT-3 to generate ideas.

# Situation

UX team from KPMG needs to organize brain storming workshop, its goal is to inspire participants to see things in a different perspective. The participants will be asked several questions and share the ideas on the Post-it, within a time constraint of 40 seconds.

# Challenge

During the brain storming session, it's difficult to leave our own comfort zone and comes with creative ideas within short period of time. Furthermore, most of participants of workshop comes from a specific background and have their own domain expertise, which harden the process of brain storming.

# Solution

We create a Miro plugin which allow participants asking question to GPT-3 and the response will be directly display in Miro board.

# Feature

- Select type of ideas.
- Edit and Select ideas.

## How to start:

- Run `yarn` or `npm install` to install dependencies
- Run `yarn start` or `npm start` to start developing, you should have a URL
  that looks like this

```
http://localhost:3000
```

- Paste the URL in `App URL` in your app settings
- open a board & you should see your app in the main toolbar when you click the
  three dots.

## How to build the app:

Run `yarn run build` or `npm run build` and this will generate a static output
inside `dist/` which you can host on static hosting service.

### About the app ( miro plugin)

This app is using [vite](https://vitejs.dev/) so you can check the documentation
if you want to modify `vite.config.js` configuration if needed.
