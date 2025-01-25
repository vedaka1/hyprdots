from fabric.widgets.box import Box
from fabric.widgets.button import Button
from fabric.widgets.label import Label

import modules.icons as icons
from utils.common import execute


class Controls(Box):
    def __init__(self, **kwargs):
        super().__init__(
            name='controls',
            orientation='h',
            spacing=4,
            v_align='center',
            h_align='center',
            visible=True,
            all_visible=True,
        )

        self.wifi = Button(
            name='controls-button',
            child=Label(name='controls-button-label', markup=icons.wifi),
            on_clicked=lambda *_: execute("notify-send 'Botón presionado' '¡Funciona!'"),
        )

        self.bluetooth = Button(
            name='controls-button',
            child=Label(name='controls-button-label', markup=icons.bluetooth),
            on_clicked=lambda *_: execute("notify-send 'Botón presionado' '¡Funciona!'"),
        )

        self.night_mode = Button(
            name='controls-button',
            child=Label(name='controls-button-label', markup=icons.night),
            on_clicked=lambda *_: execute("notify-send 'Botón presionado' '¡Funciona!'"),
        )

        self.caffeine = Button(
            name='controls-button',
            child=Label(name='controls-button-label', markup=icons.coffee),
            on_clicked=lambda *_: execute("notify-send 'Botón presionado' '¡Funciona!'"),
        )

        for button in [self.wifi, self.bluetooth, self.night_mode, self.caffeine]:
            self.add(button)
