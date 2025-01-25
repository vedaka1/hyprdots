const powerProfiles = await Service.import('powerprofiles')

const label = Widget.Label({
    label: powerProfiles.bind('active_profile'),
})

export const PowerButton = () => {
    return Widget.Button({
        child: label,
        on_clicked: () => {
            switch (powerProfiles.active_profile) {
                case 'balanced':
                    powerProfiles.active_profile = 'performance';
                    break;
                default:
                    powerProfiles.active_profile = 'balanced';
                    break;
            };
        },
    })
}