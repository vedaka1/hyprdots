from typing import Any

from fabric import Fabricator
from fabric.widgets.box import Box
from fabric.widgets.label import Label
from psutil import sensors_battery

import modules.icons as icons


class Battery(Box):
    def __init__(self, **kwargs) -> None:
        super().__init__(spacing=4, **kwargs)
        self.children = [Label(name='battery-icon', label=''), Label(name='battery-text', label='0')]
        self.battery_level_fabricator = Fabricator(
            interval=1000,
            poll_from=lambda f: sensors_battery(),
            on_changed=lambda f, v: self.update_label(v),
        )

    def update_label(self, battery: Any) -> None:
        l_icon: Label = self.children[0]
        l_text: Label = self.children[1]

        l_text.set_label(f'{int(battery.percent)}%')
        if battery.power_plugged:
            l_icon.set_markup(icons.battery)
        else:
            l_icon.set_markup('')
