import os
from dataclasses import dataclass
from functools import lru_cache


@dataclass(frozen=True)
class BaseConfig:
    CSS_FILE: str = 'main.css'
    RELOAD_STYLES_ON_CHANGE: bool = True
    PROC_NAME: str = 'ax-shell'

    USERNAME: str = os.getlogin()
    HOSTNAME: str = os.uname().nodename
    HOME_DIR: str = os.path.expanduser('~')
    WALLPAPERS_DIR: str = os.path.expanduser('~/.config/wallpapers')


@lru_cache(1)
def get_base_config() -> BaseConfig:
    return BaseConfig()


base_config = get_base_config()
