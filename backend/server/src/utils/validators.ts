import { check } from 'express-validator';

export const originValidator = () => [
    check("Origin").isString().notEmpty().withMessage('Origin cannot be empty').escape()
];

export const cityValidator = (field: string) => check(field).isString().notEmpty().withMessage(`${field} must be a string`).isLength({ max: 40 }).withMessage(`${field} name must be less than 40 characters`).trim().escape();

export const dateValidator = (field: string) => check(field).isDate().withMessage(`${field} must be valid date`).isLength({ max: 10 }).withMessage(`${field} must be in the format YYYY-MM-DD`).escape();

// Check endDate is also  later than startDate
export const endDateValidator = () => check('endDate').custom((value, { req }) => {
    const startDate = req.query?.startDate;
    if (startDate && new Date(value) < new Date(startDate)) {
        throw new Error('End date must be later than start date');
    }
    return true;
});