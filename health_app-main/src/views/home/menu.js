//icon from: https://www.svgrepo.com
export const menus = [
    {
        name: 'Workouts',
        icon: require('../../_assets/icon/workout.png'),
        screen: 'Workout',
        customStyle: {
            marginRight: 5,
            marginBottom: 5,
        }
    },
    {
        name: 'Meals',
        icon: require('../../_assets/icon/meal.png'),
        screen: 'Meal',
        customStyle: {
            marginLeft: 5,
            marginBottom: 5
        }
    },
    {
        name: 'BMI',
        screen: 'BMI Calculate',
        icon: require('../../_assets/icon/bmi.png'),
        customStyle: {
            marginRight: 5,
            marginTop: 5
        }
    },
    {
        name: 'Daily Water',
        screen: 'Daily Water',
        icon: require('../../_assets/icon/clock.png'),
        customStyle: {
            marginLeft: 5,
            marginTop: 5
        }
    }
]
