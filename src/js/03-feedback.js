import lodash from 'lodash';
import { save, load, remove } from './storage';

const formRef = document.querySelector('.feedback-form');
const LOCAL_STORAGE_KEY = 'feedback-form-state';

initPage();

const onFormInput = event => {
  const { name, value } = event.target;
  let saveData = load(LOCAL_STORAGE_KEY);
  saveData = saveData ? saveData : {};
  saveData[name] = value;
  save(LOCAL_STORAGE_KEY, saveData);
};

const throttleFormInput = lodash.throttle(onFormInput, 500);

formRef.addEventListener('input', throttleFormInput);

const submitData = event => {
  event.preventDefault();
  const {
    elements: { email, message },
  } = event.currentTarget;
  console.log({ email: email.value, message: message.value });
  remove(LOCAL_STORAGE_KEY);
  event.currentTarget.reset();
};

formRef.addEventListener('submit', submitData);

function initPage() {
  const savedData = load(LOCAL_STORAGE_KEY);
  if (savedData) {
    Object.entries(savedData).forEach(([name, value]) => {
      formRef.elements[name].value = value;
    });
  }
}
