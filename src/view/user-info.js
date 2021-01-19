const getUserRank = (watchedQuantity) => {
  let rank = ``;
  if (watchedQuantity > 1 && watchedQuantity <= 10) {
    rank = `novice`;
  } else if (watchedQuantity >= 11 && watchedQuantity <= 20) {
    rank = `fan`;
  } else if (watchedQuantity >= 21) {
    rank = `movie buff`;
  }
  return rank;
};

const createUserInfoTemplate = (films) => {
  const watchedQuantity = films.reduce((accumulator, curFilm) => {
    return accumulator + +curFilm.userDetails.alreadyWatched;
  }, 0);
  const rank = getUserRank(watchedQuantity);

  return `<section class="header__profile profile">
            <p class="profile__rating">${rank}</p>
            <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          </section>`;
};

export {createUserInfoTemplate};
