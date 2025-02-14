import gi
from fabric.widgets.box import Box

from modules.mrpis import create_mpris_player

gi.require_version('Gtk', '3.0')
gi.require_version('Vte', '2.91')
from modules.dashboard.modules.buttons import Buttons


class Widgets(Box):
    def __init__(self, **kwargs):
        super().__init__(
            name='dash-widgets',
            h_align='center',
            v_align='start',
            h_expand=True,
            v_expand=True,
            visible=True,
            all_visible=True,
        )

        self.notch = kwargs['notch']
        self.buttons = Buttons(notch=self.notch)
        self.player = create_mpris_player()

        self.box_2 = Box(
            name='box-2',
            h_expand=True,
            children=(self.player),
        )

        self.container_1 = Box(
            name='container-1',
            orientation='h',
            spacing=8,
            children=[
                self.box_2,
            ],
        )

        self.container_2 = Box(
            name='container-2',
            orientation='v',
            spacing=8,
            children=[
                self.buttons,
                self.container_1,
            ],
        )

        self.container_3 = Box(
            name='container-3',
            orientation='h',
            spacing=8,
            children=[
                self.container_2,
            ],
        )

        self.add(self.container_3)

        self.show_all()
