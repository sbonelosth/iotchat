export const validateRegistration = (name: string, value: string, errors: any) => {
    if (name === 'studentNumber') {
        const usernameRegex = /^[0-9]*$/;
        if (!usernameRegex.test(value)) {
            errors.username = 'Only numbers are allowed.';
        } else {
            errors.username = '';
        }
    }

    if (name === 'password') {
        if (value.length < 8) {
            errors.password = 'Password should be at least 8 characters long.';
        } else {
            errors.password = '';
        }
    }

    return errors;
};