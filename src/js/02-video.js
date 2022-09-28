import Player from '@vimeo/player';
import _ from 'lodash';

const iframe = document.querySelector('iframe');
const player = new Player(iframe);

let playerPosition = 0;

player
  .setCurrentTime(30.456)
  .then(function (seconds) {
    console.log(seconds);
    // seconds = the actual time that the player seeked to
  })
  .catch(function (error) {
    switch (error.name) {
      case 'RangeError':
        // the time was less than 0 or greater than the video’s duration
        break;

      default:
        // some other error occurred
        break;
    }
  });

console.log(`Local cookie time: ${document.cookie}`);

const timeLog = ({ seconds }) => {
  playerPosition = seconds;
  np;
  document.cookie = `${playerPosition}`;
  // console.log(playerPosition);
  console.log(document.cookie);
};

player.on('timeupdate', _.throttle(timeLog, 1000));

// _.throttle(() => {
//   console.log(localStorage);
// }, 10000);

// ---

player.on('play', function () {
  console.log('played the video!');
});

player.getVideoTitle().then(function (title) {
  console.log('title:', title);
});

player.getDuration().then(duration => {
  console.log(duration);
});

// player.on('timeupdate', ({ seconds }) => {
//   _.throttle(console.dir(seconds), 10000);
// });

// document.addEventListener(
//   'keydown',
//   _.throttle(event => {
//     console.log(event.key);
//   }, 1000)
// );
