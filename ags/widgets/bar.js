import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';



const myLabel = Widget.Label({
    className: "test-bar",
    label: 'Hello BAR'
});

export default () => Widget.Window({
    name: 'bar',
    anchor: ['left', 'top',  'right'],
    child: myLabel,
});
