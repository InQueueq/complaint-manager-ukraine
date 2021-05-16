import axios from 'axios';

export const register = async (newUser) => {
    const res = await axios.post('users/register', {
        email: newUser.email,
        password: newUser.password,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        organisation: newUser.organisation,
        userType: newUser.userType,
    });

    return res;
};

export const login = async (user) => {
    const res = await axios.post('users/login', {
        email: user.email,
        password: user.password,
    });

    localStorage.setItem('token', res.data.token);

    return res;
};

export const openProfile = async (token) => {
    const res = await axios.get('/users/profile/info', {
        headers: {
            Authorization: token,
        },
    });

    return res;
};

export const editProfile = async (user, token) => {
    const res = await axios.put(
        '/users/profile/info',
        {
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            organisation: user.organisation,
            userType: user.userType,
        },
        {
            headers: {
                Authorization: token,
            },
        },
    );

    return res;
};

export const validateToken = async (token) => {
    const res = await axios.get('/users/user/token', {
        headers: {
            Authorization: token,
        },
    });

    return res;
};
