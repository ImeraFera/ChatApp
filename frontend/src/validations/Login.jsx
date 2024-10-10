import * as Yup from 'yup'

export const loginSchema = Yup.object({
    email: Yup.string()
        .email('Geçersiz e-posta adresi')
        .required('E-posta zorunludur'),
    password: Yup.string()
        .required('Parola zorunludur')
        .min(6, 'Parola en az 6 karakter olmalıdır'),

});

