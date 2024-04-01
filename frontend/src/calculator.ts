import { greetUser } from '$utils/greet';

document.addEventListener('DOMContentLoaded', function () {

window.Webflow ||= [];
window.Webflow.push(() => {
    const name = 'John Does';
    greetUser(name);
});

})