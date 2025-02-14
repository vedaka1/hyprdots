from fabric.widgets.wayland import WaylandWindow as Window

from utils.common import send_signal
from utils.monitors import get_hyprland_monitors


class NotchController(Window):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def open_notch(self, widget: str):
        monitor_id = get_hyprland_monitors().get_current_gdk_monitor_id()
        send_signal(f'notch_{monitor_id}.open_notch("{widget}")')
