"use strict";

const users = responseData.map((user) => createUserCard(user));
const cardsContainer = document.querySelector(".usersProfiles");

cardsContainer.append(...users);

function errorImageHandler({target}){
  target.hidden = true;
}

function loadImageHandler({target}){
  target.hidden = false;
}

function createElement(tagName, {
  classNames = [],
  handlers = {},
  attributes = {}
}, ...children){
  const element = document.createElement(tagName);
  element.classList.add(...classNames);

  for(const [attributeName, attributeValue] of Object.entries(attributes)){
    element.setAttribute(attributeName, attributeValue);
  }

  for(const [eventType, eventHandler] of Object.entries(handlers)){
    element.addEventListener(eventType, eventHandler);
  }
  element.append(...children);
  return element;
}

function createUserCard({id, firstName, lastName, profilePicture, contacts}){
  const imageWrapper = createImageWrapper(id, profilePicture, firstName, lastName);
  const fullName = getFullName(firstName, lastName);
  const headingText = fullName.length ? fullName : "Unknown Person";
  const h2 = createElement("h2", {classNames: ["userName"]}, document.createTextNode(headingText));
  const socialBlock = createSocialBlock(contacts);
  const article = createElement("article", {classNames : ["userCard"]}, imageWrapper, h2, socialBlock);
  return article;
}

function createImageWrapper(id, profilePicture, firstName, lastName){
  const img = createElement("img", {classNames: ["userImage"], handlers: {
    error : errorImageHandler,
    load : loadImageHandler
  }, attributes: {
    src: profilePicture,
    alt: `user id = ${id}`,
    hidden: false
  }});
  const fullName = getFullName(firstName, lastName);
  const initialsText = fullName.length ? firstName[0] + lastName[0] : "UP";
  const initials = createElement("div", {classNames: ["initials"]}, createElement("span", {}, document.createTextNode(initialsText)));
  initials.style.backgroundColor = stringToColor(initialsText);
  const imageWrapper = createElement("div", {classNames: ["imageWrapper"]},initials, img);
  return imageWrapper;
}

function createSocialBlock(contacts){
  const socialIcons = [];
  for(const contact of contacts){
    const url = new URL(contact).host;
    if(socials[url]){
      socialIcons.push(createElement("a", { classNames: ["socialButton"], attributes : {
        href : contact,
        target: "blank"
      }
    },createElement("i", {classNames : socials[url].split(" ")})))
    }
  }
  const socialBlock = createElement("div", {classNames: ["socials"]}, ...socialIcons);
  return socialBlock;
}

function getFullName(firstName, lastName){
  return `${firstName} ${lastName}`.trim();
}

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}