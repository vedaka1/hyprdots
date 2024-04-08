import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';



const myLabel = Widget.Label({
    className: "test",
    label: 'Hello!!!'
});

export default () => Widget.Window({
    name: 'notifications',
    anchor: ['top',  'right'],
    child: myLabel,
});
