import moment from "moment";
import {supabaseClient} from "../config/supabase";

const DAILY_WATER_TABLE = 'daily_water';

class DailyWaterService {

    updateDailyWater(userId: number, type: string) {
        let date = moment(new Date()).format("YYYY/MM/DD");

        const callable = supabaseClient.from(DAILY_WATER_TABLE)
                .select('*')
                .eq('user_id', userId)
                .eq('date', date);

        return callable.then(({data}) => {
            if (data.length === 0 || !data[0].user_id) {
                return supabaseClient
                        .from(DAILY_WATER_TABLE)
                        .insert({
                            user_id: userId,
                            date: date,
                            number_glass: 1
                        }).single();
            } else {
                return supabaseClient
                        .from(DAILY_WATER_TABLE)
                        .update({
                            user_id: userId,
                            date: date,
                            number_glass: type === 'increase' ? data[0].number_glass + 1 : data[0].number_glass - 1
                        })
                        .eq('id', data[0].id)
                        .single();
            }
        })
    }

    readDailyWater(userId: number) {
        let date = moment(new Date()).format("YYYY/MM/DD");
        return supabaseClient.from(DAILY_WATER_TABLE)
                .select('*')
                .eq('user_id', userId)
                .eq('date', date)
                .single()
                .then(res => {
                    return res.data?.number_glass;
                });

    }
}

export default new DailyWaterService();
