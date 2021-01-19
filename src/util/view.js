const PlaceType = {
  BEFORE_BEGIN: `beforebegin`,
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`,
};

const render = (container, markup, place) => {
  container.insertAdjacentHTML(place, markup);
};

const humanizeFilmDuration = (durationInMinutes) => {
  const minInHour = 60;
  let humanizedFormat = `${durationInMinutes}m`;
  if (durationInMinutes >= minInHour) {
    humanizedFormat = `${Math.floor(durationInMinutes / minInHour)}h ${durationInMinutes % minInHour}m`;
  }
  return humanizedFormat;
};

export {PlaceType, render, humanizeFilmDuration};
