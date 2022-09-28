import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';
import {REACT_APP_SUPABASE_KEY, REACT_APP_SUPABASE_URL} from './constants';

export const supabaseClient = createClient(REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY, {
    localStorage: AsyncStorage,
});
