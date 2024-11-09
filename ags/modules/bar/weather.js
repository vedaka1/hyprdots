const CITY = "Архангельск"


function getWeather() {
    return Utils.fetch(`https://wttr.in/${CITY}?format=1`)
        .then((res) => {
            return res.text()
        })
        .then((data) => {
            return data
        })
        .catch(console.error)
}
const weather = Variable("No weather",{
    poll: [
        100000,
        () => {return getWeather()}
    ]
})
export const Weather = () => {
    return Widget.Label({
        class_name: "weather",
        label: weather.bind().as(value => value.replace(/\n/g, ''))
    })
}