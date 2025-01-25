import setproctitle
from fabric import Application
from fabric.utils import get_relative_path, monitor_file

from config import get_base_config
from modules.bar import Bar
from modules.notch import Notch
from utils.common import create_module
from utils.monitors import get_monitors_ids


# from modules.overview import Overview
def apply_stylesheet(*_) -> None:
    return app.set_stylesheet_from_file(get_relative_path(config.CSS_FILE))


if __name__ == '__main__':
    config = get_base_config()
    setproctitle.setproctitle(config.PROC_NAME)

    app = Application(config.PROC_NAME)

    # corners = Corners()

    for i in get_monitors_ids():
        app.add_window(create_module(f'bar_{i}', Bar, i, globals()))
        app.add_window(create_module(f'notch_{i}', Notch, i, globals()))

    if config.RELOAD_STYLES_ON_CHANGE:
        style_monitor = monitor_file(get_relative_path(config.CSS_FILE))
        style_monitor.connect('changed', apply_stylesheet)

    apply_stylesheet()  # initial styling

    app.run()
