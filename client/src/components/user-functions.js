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

export const getRegionId = async (regionName) => {
    const res = await axios.get('/regions', {
        params: {
            regionName,
        },
    });

    return res;
};

export const createComplaint = async (complaint) => {
    const res = await axios.post('complaints/', {
        name: complaint.name,
        description: complaint.description,
        longitude: complaint.longitude,
        latitude: complaint.latitude,
        creator: complaint.creator,
        inProcess: complaint.inProcess,
        region: complaint.region,
        createdAt: complaint.createdAt,
        rating: 0,
    });

    return res;
};

export const getMarkers = async () => {
    const res = await axios.get('complaints/');

    return res;
};

export const getMarkersOfUser = async (userId) => {
    const res = await axios.get(`/complaints/user/${userId}`);

    return res;
};

export const getMarker = async (markerId) => {
    const res = await axios.get(`complaints/${markerId}`);

    return res;
};

export const getMarkerImages = async (markerId) => {
    const res = await axios.get(`images/${markerId}`);

    return res;
};

export const getUser = async (userId) => {
    const res = await axios.get(`users/${userId}`);

    return res;
};

export const processImages = async (images, markerId, creatorId) => {
    let fd = new FormData();

    for (let i = 0; i < images.length; i++) {
        fd.append('file', images[i], `${markerId}_${images[i].name}`);
    }

    const res = await axios.post('images/', fd, {
        headers: {
            'content-type': 'multipart/form-data',
        },
    });

    return res;
};

export const changeRating = async (like) => {
    const res = await axios.post('likes/', {
        isPositive: like.isPositive,
        markerId: like.markerId,
        userId: like.userId,
    });

    return res;
};

export const updateMarkerStatus = async (markerId, inProcess) => {
    const res = await axios.post('complaints/resolve', {
        _id: markerId,
        inProcess: inProcess,
    });

    return res;
};
