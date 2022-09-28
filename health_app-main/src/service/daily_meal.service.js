import moment from "moment";
import {supabaseClient} from "../config/supabase";

const DAILY_MEAL_TABLE = 'daily_meal';

class DailyMealService {

    getDailyMealsByUserId(userId: number, ) {
        let date = moment(new Date()).format("YYYY/MM/DD");

        return supabaseClient.from(DAILY_MEAL_TABLE)
                .select('*')
                .eq('user_id', userId)
                .eq('date', date)
                .then(res => res.data);
    }

    saveDailyMeal(userId: number, id: number, name: string, detail: string,
                  calorie: number, fat: number, protein: number, carb: number, gram: number) {
        if (id) {
            let updateInfo = {
                name: name,
                detail: detail,
                calorie: calorie,
                fat: fat,
                protein: protein,
                carb: carb,
                gram: gram
            };
            return supabaseClient.from(DAILY_MEAL_TABLE)
                    .update(updateInfo)
                    .eq('id', id)
        } else {
            let newInfo = {
                user_id: userId,
                name: name,
                detail: detail,
                calorie: calorie,
                fat: fat,
                protein: protein,
                carb: carb,
                gram: gram,
                date: moment(new Date()).format("YYYY/MM/DD")
            };
            return supabaseClient.from(DAILY_MEAL_TABLE)
                    .insert(newInfo)
                    .single();
        }
    }

    deleteMeal(id: number) {
        return supabaseClient.from(DAILY_MEAL_TABLE)
                .delete()
                .eq('id', id)
    }

}

export default new DailyMealService();
