from fabric.system_tray.widgets import SystemTray


class Tray(SystemTray):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.hidden = True

    def on_item_added(self, _, item_identifier: str) -> None:
        super().on_item_added(_, item_identifier)
        if self.hidden:
            self.hidden = False
            self.remove_style_class('hidden')

    def on_item_removed(self, _, item_identifier: str) -> None:
        super().on_item_removed(_, item_identifier)
        if not self._items:
            self.hidden = True
            self.add_style_class('hidden')
