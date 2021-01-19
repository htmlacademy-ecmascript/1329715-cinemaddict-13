const PlaceType = {
  BEFORE_BEGIN: `beforebegin`,
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`,
};

const render = (container, markup, place) => {
  container.insertAdjacentHTML(place, markup);
};

export {PlaceType, render};
