#!/bin/bash
. ~/.config/hyprv.conf

init_fabric() {
    pkill ax-shell
    cd ~/.config/fabric; python main.py
}

set_wallpaper() {
    swww img --transition-type none $WALLPAPER_PATH
}

init_fabric
set_wallpaper