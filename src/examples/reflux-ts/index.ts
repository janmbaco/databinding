import { makeVdom } from './virtualDom';
import { MainView } from './components/main';
import { store } from './store';


setTimeout(() => {
    const $el = document.createElement('div');
    document.body.appendChild($el);
    const patch = makeVdom(null, store);
    patch($el, MainView, { value: 0 });
});

if ((module as any).hot) {
    (module as any).hot.accept(true, () => {
        window.location.reload();
    });
}