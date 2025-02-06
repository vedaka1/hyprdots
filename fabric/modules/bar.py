from fabric.hyprland.widgets import WorkspaceButton, Workspaces
from fabric.widgets.box import Box
from fabric.widgets.button import Button
from fabric.widgets.centerbox import CenterBox
from fabric.widgets.datetime import DateTime
from fabric.widgets.label import Label
from fabric.widgets.wayland import WaylandWindow as Window
from gi.repository import Gdk

from modules import icons
from modules.battery import Battery
from modules.systray import Tray
from utils.common import execute, send_signal


class Bar(Window):
    def __init__(self, **kwargs):
        super().__init__(
            name='bar',
            layer='top',
            anchor='left top right',
            margin='-8px -4px -8px -4px',
            exclusivity='auto',
            visible=True,
            all_visible=True,
            **kwargs,
        )

        self.workspaces = Workspaces(
            name='workspaces',
            invert_scroll=True,
            empty_scroll=True,
            v_align='fill',
            orientation='h',
            spacing=10,
            buttons=[WorkspaceButton(id=i, label='') for i in range(1, 11)],
        )

        self.systray = Tray(icon_size=20, name='systray')
        self.systray.add_style_class('hidden')
        self.battery = Battery(name='battery', h_align='center', v_align='center')
        self.date_time = DateTime(name='date-time', formatters=['%H:%M'], h_align='center', v_align='center')

        self.button_apps = Button(
            name='button-bar',
            on_clicked=lambda *_: self.search_apps(),
            child=Label(name='button-bar-label', markup=icons.apps),
        )
        self.button_apps.connect('enter_notify_event', self.on_button_enter)
        self.button_apps.connect('leave_notify_event', self.on_button_leave)

        self.button_power = Button(
            name='button-bar',
            on_clicked=lambda *_: self.power_menu(),
            child=Label(name='button-bar-label', markup=icons.shutdown),
        )
        self.button_power.connect('enter_notify_event', self.on_button_enter)
        self.button_power.connect('leave_notify_event', self.on_button_leave)

        self.bar_inner = CenterBox(
            name='bar-inner',
            orientation='h',
            h_align='fill',
            v_align='center',
            start_children=Box(
                name='start-container',
                spacing=4,
                orientation='h',
                children=[
                    self.button_apps,
                    Box(name='workspaces-container', children=[self.workspaces]),
                ],
            ),
            end_children=Box(
                name='end-container',
                spacing=4,
                orientation='h',
                children=[
                    self.systray,
                    self.battery,
                    self.date_time,
                    self.button_power,
                ],
            ),
        )

        self.children = self.bar_inner

        self.hidden = False

        self.show_all()

    def on_button_enter(self, widget, event):
        window = widget.get_window()
        if window:
            window.set_cursor(Gdk.Cursor(Gdk.CursorType.HAND2))

    def on_button_leave(self, widget, event):
        window = widget.get_window()
        if window:
            window.set_cursor(None)

    def on_button_clicked(self, *args):
        # Ejecuta notify-send cuando se hace clic en el botón
        execute("notify-send 'Botón presionado' '¡Funciona!'")

    def search_apps(self):
        send_signal(f'notch_{self.monitor}.open_notch("launcher")')

    def power_menu(self):
        send_signal(f'notch_{self.monitor}.open_notch("power")')

    def toggle_hidden(self):
        self.hidden = not self.hidden
        if self.hidden:
            self.bar_inner.add_style_class('hidden')
        else:
            self.bar_inner.remove_style_class('hidden')
