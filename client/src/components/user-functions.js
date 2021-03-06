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

export const activateUser = async (id) => {
    const res = await axios.patch('/users/activate', {
        id,
        isActive: true,
    });

    return res;
};

export const isActivated = async (email) => {
    const res = await axios.post('/users/isActivated', {
        email,
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
        isMilitary: complaint.isMilitary,
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

export const getMarkersForRegion = async (regionId) => {
    const res = await axios.get(`complaints/region/${regionId}`);

    return res;
};

export const getMarkersOfUser = async (userId) => {
    const res = await axios.get(`/complaints/user/${userId}`);

    return res;
};

export const getRegions = async () => {
    const res = await axios.get('/regions/all');

    return res.data;
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
    const res = await axios.get(`/users/${userId}`);

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

export const getUnresolvedMarkersCountByUserId = async (userId) => {
    const res = await axios.get(`/complaints/count/${userId}`);

    return res.data;
};

export const getUnapprovedAuthorities = async () => {
    const res = await axios.get(`/admin/authorities/unapproved`);

    return res.data;
};

export const getAuthorities = async () => {
    const res = await axios.get(`/admin/authorities`);

    return res.data;
};

export const approveAuthorityByUserId = async (userId) => {
    const res = await axios.post('/admin/authorities/approve', {
        _id: userId,
    });

    return res.data;
};

export const deleteAuthorityByUserId = async (userId) => {
    const res = await axios.delete(`/admin/authorities/${userId}`);

    return res.data;
};

export const deleteMarkersByUserId = async (userId) => {
    const res = await axios.delete(`/complaints/user/${userId}`);

    return res.data;
};

export const deleteImagesByMarkerIds = async (markerIds) => {
    const res = await axios.post(`/images/complaints/remove`, {
        ids: markerIds,
    });

    return res.data;
};

export const deleteLikesByMarkerIds = async (markerIds) => {
    const res = await axios.post(`/likes/complaints/remove`, {
        ids: markerIds,
    });

    return res.data;
};

export const deleteLikesByUserId = async (userId) => {
    const res = await axios.delete(`/likes/authorities/${userId}`);

    return res.data;
};
