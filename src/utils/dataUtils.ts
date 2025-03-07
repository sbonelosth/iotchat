import { User } from "../types/index";

export const mapUserData = (user: any) => {
    return {
        username: user.username,
        name: user.name,
        email: user.email,
        faculty: user.faculty,
        department: user.department,
        course: user.course,
        joined: user.joined,
        accessToken: user.accessToken,
    } as Partial<User>;
}