const UserTypes = {
    GUEST: 0,
    USER: 1,
    AUTHORITY: 2,
    ADMIN: 3,
};

function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
}

module.exports.UserTypes = UserTypes;
module.exports.getKeyByValue = getKeyByValue;
