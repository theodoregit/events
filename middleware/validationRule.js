const {check, sanitizeBody } = require('express-validator')

exports.form = [
    //full name validation 
    check('fullname').notEmpty().withMessage('Full name required')
    .isLength({min: 3}).withMessage('Full name must be minimum 3 length')
    .matches(/^[a-z+\s+A-Z]/i).withMessage('Only character with white space are allowed'),
    // phone number validation 
    check('phoneNumber').notEmpty().withMessage('Full name required')
    .isLength({min: 9}).withMessage('Phone number must be minimum 9 length')
    .matches(/(?=.*?[0-9])/).withMessage('Only numbers are allowed'),
    //email address validation
    check('email').normalizeEmail().isEmail().withMessage('Must be a valid email'),
    //password validation 
    check('password').trim().notEmpty().withMessage('Password required')
    .isLength({ min: 6 }).withMessage('password must be minimum 6 length')
    .matches(/(?=.*?[A-Z])/).withMessage('At least one Uppercase')
    .matches(/(?=.*?[a-z])/).withMessage('At least one Lowercase')
    .matches(/(?=.*?[0-9])/).withMessage('At least one Number')
    .matches(/(?=.*?[#?!@$%^&*-])/).withMessage('At least one special character')
    .not().matches(/^$|\s+/).withMessage('White space not allowed'),
    // confirm password validation
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password Confirmation does not match password');
        }
        return true;
    })
]