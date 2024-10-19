# Frontend Mentor - Tip calculator app solution

This is a solution to the [Tip calculator app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/tip-calculator-app-ugJNGbJUX). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Calculate the correct tip and total cost of the bill per person

### Screenshot

![Screenshot of the solution](./screenshot.jpg)

### Links

- Solution URL: [https://github.com/webdevbynight/tip-calculator-app-main](https://github.com/webdevbynight/tip-calculator-app-main)
- Live Site URL: [https://webdevbynight.github.io/tip-calculator-app-main/](https://webdevbynight.github.io/tip-calculator-app-main/)

## My process

### Built with

- Semantic HTML5 markup
- CSS (via SCSS)
  - custom properties
  - logical properties
  - flexbox
  - grid
- JavaScript (via TypeScript)
- Mobile-first workflow

### What I learned

I learnt the `input` event to handle form changes when the `submit` event cannot be used (because of a lack of submit buttons, for example).

When customising the appearance of an `input` element with the `type="number"` attribute, to remove the arrows, the `appearance: none` declaration does not remove the arrows. To remove them, the `appearance: textfield` declaration works on Firefox and Google Chrome, but not on Safari (Safari 18 at the time when I wrote these lines); to remove them on Safari, the use of the proprietary non-standard `::-webkit-inner-spin-button` is the solution I found:
```css
input[type="number"] {
  appearance: textfield; /* Arrows are removed on Firefox and Google Chrome */
  
  /* To remove arrows on Safari 18- */
  &::-webkit-inner-spin-button {
    display: none;
  }
}
```

### Useful resources

- [Styling an input type=number](https://stackoverflow.com/questions/26024771/styling-an-input-type-number) - Despite the age of this topic on Stack Overflow, it helped me to find a way to remove the arrows on an `input` element with the `type="number"` attribute on Safari.
- [Element: `input` event](https://developer.mozilla.org/en-US/docs/Web/API/Element/input_event) - This article from MDN helped me to understand the `input` event.

## Author

- Website - [Victor Brito](https://victor-brito.dev)
- Frontend Mentor - [@webdevbynight](https://www.frontendmentor.io/profile/webdevbynight)
- Mastodon - [@webdevbynight](https://mastodon.social/webdevbynight)

## Acknowledgments

I would like to aknowledge the people who helped me on the [Pinqo](https://www.linkedin.com/company/pinqo/) Discord server to resolve the problems I faced during this challenge when implementing the JavaScript part: I really got stuck with the way I first listened to the form changes.
