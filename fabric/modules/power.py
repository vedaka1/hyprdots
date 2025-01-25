from collections.abc import Callable

from fabric.widgets.box import Box
from fabric.widgets.button import Button
from fabric.widgets.label import Label

import modules.icons as icons
from utils.common import execute, send_signal


def create_power_btn(
    icon: str,
    func: Callable,
    name: str = 'power-menu-button',
    l_name: str = 'button-label',
) -> Button:
    return Button(name=name, child=Label(name=l_name, markup=icon), on_clicked=func)


class PowerMenu(Box):
    def __init__(self, monitor: int = 0, **kwargs):
        super().__init__(
            name='power-menu',
            orientation='h',
            spacing=4,
            v_align='center',
            h_align='center',
            v_expand=True,
            h_expand=True,
            visible=True,
            **kwargs,
        )
        self._monitor = monitor

        self.btn_lock = create_power_btn(icons.lock, self.lock)
        self.btn_suspend = create_power_btn(icons.suspend, self.suspend)
        self.btn_logout = create_power_btn(icons.logout, self.logout)
        self.btn_reboot = create_power_btn(icons.reboot, self.reboot)
        self.btn_shutdown = create_power_btn(icons.shutdown, self.poweroff)

        self.buttons = (self.btn_lock, self.btn_suspend, self.btn_logout, self.btn_reboot, self.btn_shutdown)
        for button in self.buttons:
            self.add(button)

        self.show_all()

    def close_menu(self):
        send_signal(f'notch_{self._monitor}.close_notch()')

    # Métodos de acción
    def lock(self, *args):
        print('Locking screen...')
        execute('loginctl lock-session')
        self.close_menu()

    def suspend(self, *args):
        print('Suspending system...')
        execute('systemctl suspend')
        self.close_menu()

    def logout(self, *args):
        print('Logging out...')
        execute('hyprctl dispatch exit')
        self.close_menu()

    def reboot(self, *args):
        print('Rebooting system...')
        execute('systemctl reboot')
        self.close_menu()

    def poweroff(self, *args):
        print('Powering off...')
        execute('systemctl poweroff')
        self.close_menu()
