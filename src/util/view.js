const PlaceType = {
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`,
};

const render = (container, domElement, place) => {
  switch (place) {
    case PlaceType.AFTER_BEGIN:
      container.prepend(domElement);
      break;
    case PlaceType.BEFORE_END:
      container.append(domElement);
      break;
    case PlaceType.AFTER_END:
      container.parentNode.insertBefore(domElement, container.nextSibling);
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

export {PlaceType, render, humanizeFilmDuration, createElement};
