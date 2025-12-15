export const usersCol = "users";
export const inviteCodesCol = "invite-codes";
export const organisationsCol = "organisations";

export const membersCookieKey = "members";
export const organisationCookieKey = "organisation";

export const levelOneAccess = ["viewer", "developer", "admin", "owner"];
export const levelTwoAccess = ["developer", "admin", "owner"];
export const levelThreeAccess = ["admin", "owner"];
export const levelFourAccess = ["owner"];

export const memberLimits = {
    "free": 2,
    "hobby": 3,
    "essential": 10,
    "pro": 50,
    "enterprise": -1,
}

export const levelsToIndex = {
    "viewer": "0",
    "developer": "1",
    "admin": "2",
    "owner": "3",
}