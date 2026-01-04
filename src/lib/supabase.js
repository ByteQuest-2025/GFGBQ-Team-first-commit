// --- TWINAI CONFIGURATION ---
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ukvfgnrhdbnlvlkqpeiu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdmZnbnJoZGJubHZsa3FwZWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDc2MTksImV4cCI6MjA4MDc4MzYxOX0.8cVy_dWFwiAgNpAwLCuRSNmA72H9bv_Xs5oYNYK-wo8';

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- AUTHENTICATION ---

export async function signUp(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
        email, 
        password, 
        options: { data: { full_name: name } }
    });
    if (error) throw error;
    return data;
}

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

export async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/';
}

export async function requireAuth(callback) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        window.location.href = '/';
    } else {
        try {
            callback(session.user);
        } catch (e) {
            console.error("Error in auth callback:", e);
        }
    }
}

export async function checkRedirect() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) window.location.href = '/app';
}

export async function updateUserProfile(name, password) {
    const updates = { data: { full_name: name } };
    if (password) updates.password = password;
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return data;
}

// --- DATABASE FUNCTIONS ---

export async function dbFetchChats() {
    const { data, error } = await supabase
        .from('chats')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) return [];
    return data;
}

export async function dbCreateChat(title) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from('chats')
        .insert([{ user_id: user.id, title: title }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function dbFetchMessages(chatId) {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
    if (error) return [];
    return data;
}

export async function dbSaveMessage(chatId, role, content, agent) {
    await supabase.from('messages').insert([{ chat_id: chatId, role, content, agent }]);
}

export async function dbDeleteChat(chatId) {
    await supabase.from('chats').delete().eq('id', chatId);
}

// // --- DAILY LIMIT CHECKER ---
// export async function checkDailyLimit() {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return false;

//     // 1. Check if user is PRO
//     const { data: profile } = await supabase
//         .from('profiles')
//         .select('is_pro')
//         .eq('id', user.id)
//         .single();

//     if (profile && profile.is_pro) {
//         return true; 
//     }

//     // 2. Count chats created TODAY
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const todayISO = today.toISOString();

//     const { count, error } = await supabase
//         .from('chats')
//         .select('*', { count: 'exact', head: true })
//         .eq('user_id', user.id)
//         .gte('created_at', todayISO);

//     if (count >= 1) return false;

//     return true;
// }

