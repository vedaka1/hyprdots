from functools import lru_cache

from fabric.notifications.service import (
    Notifications,
)


@lru_cache(1)
def get_notification_server() -> Notifications:
    return Notifications()
