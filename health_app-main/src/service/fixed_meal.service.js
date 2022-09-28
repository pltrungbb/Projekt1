import {supabaseClient} from '../config/supabase';

const FIXED_MEAL_TABLE = 'fixed_meal';

class FixedMealService {

    getFixedMeal() {
        return supabaseClient.from(FIXED_MEAL_TABLE)
                .select('*')
                .then(res => res.data);
    }
}

export default new FixedMealService();
