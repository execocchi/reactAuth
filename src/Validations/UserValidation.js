/* eslint-disable no-useless-escape */
import * as yup from "yup"


export const userSchema=yup.object().shape({
    name:yup.string().required(),
    email:yup.string().required().matches(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/),
    age:yup.number().notRequired(),
    password: yup.string().required().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
    confirmPassword:yup.string().required().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
    role:yup.string().required()

})