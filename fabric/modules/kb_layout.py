import json

from fabric.utils import exec_shell_command_async
from fabric.widgets.box import Box
from fabric.widgets.button import Button
from fabric.widgets.label import Label


class KeyboardLayoutWidget(Button):
    """A widget to display the current keyboard layout."""

    def __init__(self, **kwargs):
        super().__init__(name='keyboard', **kwargs)

        self.kb_label = Label(label='en', style_classes='panel-text', visible=False)
        self.children = (Box(children=self.kb_label),)

        exec_shell_command_async('hyprctl devices -j', lambda output: self.get_keyboard(output))

    def get_keyboard(self, value: str):
        data = json.loads(value)
        keyboards = data['keyboards']
        if len(keyboards) == 0:
            return 'Unknown'

        main_kb = next((kb for kb in keyboards if kb['main']), None)

        if not main_kb:
            main_kb = keyboards[len(keyboards) - 1]

        layout = main_kb['active_keymap']

        self.set_tooltip_text(f'Caps Lock: {main_kb["capsLock"]} | Num Lock: {main_kb["numLock"]}')

        self.kb_label.set_label(f'{layout}')
        self.kb_label.show()
