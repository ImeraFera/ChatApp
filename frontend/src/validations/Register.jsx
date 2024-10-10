import * as Yup from 'yup'

export const registerSchema = Yup.object({
    username: Yup.string()
        .required('Kullanıcı adı zorunludur')
        .min(2, 'Kullanıcı adı en az 2 karakter olmalıdır'),
    email: Yup.string()
        .email('Geçersiz e-posta adresi')
        .required('E-posta zorunludur'),
    password: Yup.string()
        .required('Parola zorunludur')
        .min(6, 'Parola en az 6 karakter olmalıdır'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Parolalar eşleşmiyor')
        .required('Parola onayı zorunludur'),
});

