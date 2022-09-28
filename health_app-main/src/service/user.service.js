import {supabaseClient} from '../config/supabase';

const USER_TABLE = 'user';

class UserService {


    login(email: string, password: string): Promise<any> {
        return supabaseClient.from(USER_TABLE)
                .select('*')
                .eq('email', email)
                .eq('password', password)
    }

    register(email: string, password: string, name: string, birthday: string): Promise<any> {
        return supabaseClient
                .from(USER_TABLE)
                .insert({
                    email: email,
                    name: name,
                    password: password,
                    birthday: birthday,
                })
                .single();
    }

    updateBmi(result: number, weight: number, height: number, id: number): Promise<any> {
        return supabaseClient.from(USER_TABLE)
                .update({
                    ibm: result,
                    weight: weight,
                    height: height
                })
                .eq('id', id)
    }

    updateProfile(password: string, name: string, birthday: string, id: number): Promise<any> {
        let updateInfo = {
            name: name,
            birthday: birthday
        };
        if (password) {
            updateInfo.password = password;
        }
        return supabaseClient.from(USER_TABLE)
                .update(updateInfo)
                .eq('id', id)
    }

}

export default new UserService();
