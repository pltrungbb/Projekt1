import {supabaseClient} from "../config/supabase";

const WORKOUT_TABLE = 'workout';

class WorkoutService {

    getWorkoutsByType(type) {
        return supabaseClient.from(WORKOUT_TABLE)
                .select('*')
                .eq('type', type)
                .then(res => res.data);
    }
}

export default new WorkoutService();
