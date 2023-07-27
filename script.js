import GameManager from "./GameManager.js";

var Container = document.querySelector(".container");

const Play = ()=> iziToast.question({
    rtl: false,
    layout: 1,
    drag: false,
    timeout: false,
    close: false,
    overlay: true,
    displayMode: 1,
    progressBar: true,
    title: 'Hey',
    message: 'Tahtayı Seç',
    position: 'center',
    inputs: [
        [`<input value="3" type="number"></input>`],
        [`<input value="3" type="number"></input>`],

    ],
    buttons: [
        ['<button><b>Onayla</b></button>', function (instance, toast, button, e, inputs) {
            
            Manager.Setup(parseInt(inputs[0].value), parseInt(inputs[1].value));

            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

        }, false],
    ]
});

var Manager = new GameManager(Container, Play);

Play();