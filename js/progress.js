import { guest } from './guest.js';

export const progress = (() => {

    let info = null;
    let bar = null;

    let total = 0;
    let loaded = 0;
    let valid = true;
    let push = true;

    const onComplete = () => {
        guest.name();
    };

    const add = () => {
        if (!push) {
            return;
        }

        total += 1;
    };

    const complete = (type) => {
        if (!valid) {
            return;
        }

        loaded += 1;
        bar.style.width = Math.min((loaded / total) * 100, 100).toString() + '%';
        info.innerText = `Cargando ${type} - completado al (${loaded}/${total}) [${parseInt((loaded / total) * 100).toFixed(0)}%]`;

        if (loaded === total) {
            onComplete();
        }
    };

    const invalid = (type) => {
        info.innerText = `Error al cargar ${type} (${loaded}/${total}) [${parseInt((loaded / total) * 100).toFixed(0)}%]`;
        bar.style.backgroundColor = 'red';
        valid = false;
    };

    const run = async () => {
        document.querySelectorAll('img').forEach((asset) => {
            asset.onerror = () => {
                invalid('imagenes');
            };
            asset.onload = () => {
                complete('imagenes');
            };

            if (asset.complete && asset.naturalWidth !== 0 && asset.naturalHeight !== 0) {
                complete('imagenes');
            } else if (asset.complete) {
                invalid('imagenes');
            }
        });
    };

    const init = () => {
        document.querySelectorAll('img').forEach(add);

        info = document.getElementById('progress-info');
        bar = document.getElementById('progress-bar');
        info.style.display = 'block';

        push = false;
        run();
    };

    return {
        init,
        add,
        invalid,
        complete,
    };
})();