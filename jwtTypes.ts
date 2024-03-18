export interface JWTContent {
    userInfo: {
        _id: string,
        fullname: { first: string, last: string; },
        email: string,
        profilepicture: string;
    };
}

