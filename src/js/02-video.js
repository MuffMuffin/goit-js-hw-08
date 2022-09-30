import Player from '@vimeo/player';
import _ from 'lodash';
import { save, load, remove } from './storage';

const LOCAL_STORAGE_KEY = 'videoplayer-current-time';
const video = document.querySelector('#vimeo-player');
const player = new Player(video);

video.style.cssText = `position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, 0%);
  box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;`;

// ----------- MIRROR EFFECT BEGIN -----------
// Нажаль - фігня. Я не зміг синхронізувати вспливаюче меню на плеєрах.
//
// Спроба 1 - Модифікувати вміст плеєра: насильно ховати елементи "рефлекції"
//            манипулюючи CSS через скрипт. Неможливо, оскільки жава не бачить
//            iframe через захист від кросс-сайтових аттак (чи як там)
//
// Спроба 2 - Скріншот на канвас: записувати вміст плеєра та проектувати
//            його "рефлекцію". Але браузер не дає скріншотити без підтверження
//            юзера. HTML2Canvas - та ж сама проблема що і в 1 пункті.
//
// Спроба 3 - Делегування евентів: поставити ширму перед плеєром щоб мишка не дьоргала
//            головний плеєр і пропускати/делегувати лише кліки(маусдауни). Взагалі я
//            закинув цю тему, бо мені здалось що джаву не пусте у вміст iframe.
//
// Якщо б був Vimeo Plus то контролі можна б було скрити. Якщо б був Vimeo Pro, то
// можна було б за "рефлекцію" взяти сурс відео в MP4 чи що.
//
// Взагалі такий еффект можливо зробити з контентом в iframe з іншого сайту?

video.insertAdjacentHTML(
  'afterend',
  `<iframe
      id="vimeo-reflection"
      src="https://player.vimeo.com/video/236203659?autopause=false"
      width="640"
      height="360"
      frameborder="0"
      allowfullscreen
      allow="autoplay; encrypted-media"
    ></iframe>`
);

const reflect = document.querySelector('#vimeo-reflection');
const reflection = new Player(reflect);

reflect.style.cssText = `position: absolute;
  pointer-events: none;
  top: calc(10% + 360px);
  left: 50%;
  opacity: 0.5;
  transform: translate(-50%, 0%) perspective(400px) rotatex(220deg)
    translatey(-50px) translateZ(-110px);
  -webkit-mask-image: linear-gradient(transparent 50%, #fafafa 90%);
  mask-image: linear-gradient(transparent 50%, #fafafa 90%);`;

reflection.setMuted(true);

player.setAutopause(false);

video.focus();

player.on('play', () => {
  player.getCurrentTime().then(time => {
    reflection.setCurrentTime(time);
  });
  reflection.play();
});

player.on('pause', () => {
  reflection.pause();
});

// ------------ MIRROR EFFECT END ------------

onInit();

function onInit() {
  const videoTime = load(LOCAL_STORAGE_KEY);
  if (videoTime) {
    player.setCurrentTime(videoTime);
    reflection.setCurrentTime(videoTime);
  }
}

const timeLog = ({ seconds }) => {
  save(LOCAL_STORAGE_KEY, seconds);
};

player.on('timeupdate', _.throttle(timeLog, 1000));
