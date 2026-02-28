import { axios } from '../../../lib/axios';

export async function createUser(userData){
    try {
        const response = await axios.post('/users/new', userData);
        return response.data;
    } catch (err) {
        console.error('Error creating user:', err);
        throw err;
    }
}

export async function updateUser(id, userData){
    try {
        const response = await axios.put(`/users/edit/${id}`, userData);
        return response.data;
    } catch (err) {
        console.error('Error updating user data:', err);
        throw err;
    }
}

export async function getUsers(){
    try {
        const response = await axios.get('/users');
        return response.data;
    } catch (err) {
        console.error('Error fetching user data:', err);
        throw err;
    }
}

export async function logout(){
    try {
        const response = await axios.post('/users/logout');
        return response.data;
    } catch (err) {
        console.error('Error logging out:', err);
        throw err;
    }
}

export async function getUser(uuid){
    try {
        const response = await axios.get(`/users/edit/${uuid}`);
        return response.data;
    } catch (err) {
        console.error('Error getting user data:', err);
        throw err;
    }
}

export async function getProfile(){
    try {
        const response = await axios.get('/users/profile');
        return response.data;
    } catch (err) {
        console.error('Error getting profile data:', err);
        throw err;
    }
}

export async function deactivateUser(id){
    try {
        const response = await axios.patch('/users/deactivate', {id: id});
        return response.data;
    } catch (err) {
        console.error('Error deactivating user:', err);
        throw err;
    }
}

export async function reactivateUser(id){
    try {
        const response = await axios.patch('/users/reactivate', {id: id});
        return response.data;
    } catch (err) {
        console.error('Error reactivating user:', err);
        throw err;
    }
}

export async function importUsers(userData){
    try {
        const response = await axios.post('/users/import', {users: userData});
        return response.data;
    } catch (err) {
        console.error('Error importing users:', err);
        throw err;
    }
}