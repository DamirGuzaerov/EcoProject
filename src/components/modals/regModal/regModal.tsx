import {getErrorStyle, ModalTemplate} from "../modalTemplates/modalTemplate";
import defaultModalStyles from "../modal.module.sass";
import {Field, Form, Formik, FormikValues, getIn} from "formik";
import * as Yup from "yup";
import {useStores} from "../../../utils/hooks/use-stores";
import {observer} from "mobx-react";
import {LoginModal} from "../loginModal/loginModal";
import {PartnersLoginModal} from "../partnersLoginModal/partnersLoginModal";
import axios from "axios";
import {useState} from "react";
import {Loader} from "../../ui/loader/loader";

export const RegModal = observer(() => {
    const {modalStore: {addModal, removeModal}} = useStores();
    const [isLoading, setIsLoading] = useState(false);
    const SignupSchema = Yup.object().shape({
        phone: Yup.string()
            .required("Введите номер телефона")
            .matches(
                /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
                "Неправильный номер телефона"
            ),
        password: Yup.string()
            .required('Введите пароль')
            .min(4,
                'Минимальное количество символов - 4'),


        repeatPassword: Yup.string().when("password", {
            is: (val: string) => (!!(val && val.length > 0)),
            then: Yup.string().oneOf(
                [Yup.ref("password")],
                "Пароли должны совпадать"
            )
        })
    });

    const openModal = (modal: any) => {
        removeModal()
        addModal(modal);
    }

    const sendRequest = (values: FormikValues) => {
        setIsLoading(true);
        axios.post('/account',
            {
                username: values.phone,
                password: values.password,
                role: 'ADMIN'
            }).then((r) => {
            console.log(r);
            setIsLoading(false);
            openModal(LoginModal);
        }).catch(() => {
            setIsLoading(false);
        })
    }

    return (
        <ModalTemplate title={'Регистрация'}>
            <div className={defaultModalStyles.modal_content}>

                <Formik initialValues={{
                    phone: '',
                    password: '',
                    repeatPassword: ''
                }}
                        onSubmit={(values) => {
                            sendRequest(values);
                        }}
                        validationSchema={SignupSchema}
                >
                    {({errors, touched}) =>
                        (<Form autoComplete='off'>
                            <div className={defaultModalStyles.modal__form_container}>
                                <Field name="phone" placeholder={'Номер телефона'}
                                       style={getErrorStyle(errors, touched.phone, 'phone')}/>
                                {touched.phone && errors.phone ? (
                                    <p className={defaultModalStyles.error_message}>{errors.phone}</p>
                                ) : null}

                                <Field type="password" name="password" placeholder={'Пароль'}
                                       style={getErrorStyle(errors, touched.password, 'password')}/>
                                {touched.password && errors.password ? (
                                    <p className={defaultModalStyles.error_message}>{errors.phone}</p>
                                ) : null}

                                <Field type="password" name="repeatPassword" placeholder={'Повторите пароль'}
                                       style={getErrorStyle(errors, touched.phone, 'phone')}/>
                                {touched.password && errors.password ? (
                                    <p className={defaultModalStyles.error_message}>{errors.repeatPassword}</p>
                                ) : null}
                                {!isLoading ? (<button type="submit" className={defaultModalStyles.modal__sendButton}>
                                    <p>Зарегистрироваться</p>
                                </button>) : <Loader/>}
                            </div>
                        </Form>)}
                </Formik>

                <div className={defaultModalStyles.modal__underLinks} onClick={() => openModal(LoginModal)}>
                    <button>
                        Я уже зарегистрировался(-ась)
                    </button>
                </div>
                <button className={defaultModalStyles.modal__enterForPartnersButton}
                        onClick={() => openModal(PartnersLoginModal)}>
                    Вход для партнёров
                </button>
            </div>
        </ModalTemplate>
    );
});