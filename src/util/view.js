import {AbstractView} from "../view/abstract-view";

const RENDER_POSITION = {
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`,
};

const render = (container, component, place) => {
  if (container instanceof AbstractView) {
    container = container.element;
  }
  if (component instanceof AbstractView) {
    component = component.element;
  }

  switch (place) {
    case RENDER_POSITION.AFTER_BEGIN:
      container.prepend(component);
      break;
    case RENDER_POSITION.BEFORE_END:
      container.append(component);
      break;
    case RENDER_POSITION.AFTER_END:
      container.parentNode.insertBefore(component, container.nextSibling);
      break;
  }
};

const humanizeFilmDuration = (durationInMinutes) => {
  const minInHour = 60;
  let humanizedFormat = `${durationInMinutes}m`;
  if (durationInMinutes >= minInHour) {
    humanizedFormat = `${Math.floor(durationInMinutes / minInHour)}h ${durationInMinutes % minInHour}m`;
  }
  return humanizedFormat;
};

const createElement = (markup) => {
  const parentElement = document.createElement(`div`);
  parentElement.innerHTML = markup;
  return parentElement.firstChild;
};

export {RENDER_POSITION, render, humanizeFilmDuration, createElement};
