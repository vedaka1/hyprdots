import setproctitle
from modules.bar import Bar

from fabric import Application
from fabric.utils import get_relative_path

# from modules.overview import Overview

if __name__ == '__main__':
    setproctitle.setproctitle('ax-shell')
    # corners = Corners()
    bar = Bar()
    # notch = Notch()
    # overview = Overview()
    app = Application('ax-shell', bar)
    app.set_stylesheet_from_file(get_relative_path('main.css'))

    app.run()
