import defaultModalStyles from './../modal.module.sass';
import Icon from "../../ui/icon/icon";
import {Link, useNavigate} from "react-router-dom";
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import {ModalTemplate} from "../modalTemplates/modalTemplate";
import {useStores} from "../../../utils/hooks/use-stores";
import {observer} from "mobx-react";
import {RegModal} from "../regModal/regModal";


export const LoginModal = observer(() => {
    const {modalStore: {addModal, removeModal},
            authorizationStore: {GetToken,SetToken}} = useStores();
    const navigate = useNavigate();
    const goToProfile = () => navigate('/profile');


    const SignupSchema = Yup.object().shape({
        phone: Yup.string()
            .required("Введите номер телефона")
            .matches(
                /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
                "Неправильный номер телефона"
            ),
        password: Yup.string()
            .required("Введите пароль")
            .min(4, "Минимальное количество знаков - 4"),
    });

    const onSubmit = (phone:string,password:string)=>{
        SetToken(phone,password);
        const token = GetToken();
        if(token !== "") {
            removeModal();
            goToProfile();
        }
    }

    const changeModal = () => {
      removeModal();
      addModal(RegModal);
    }

    const openModal = (modal: any) => {
        removeModal()
        addModal(modal);
    }

    return(
        <ModalTemplate title={'Вход'}>
                <div className={defaultModalStyles.modal_content}>

                    <Formik  initialValues={{
                        phone: '',
                        password: '',
                    }}
                             validationSchema={SignupSchema}
                             onSubmit={values => onSubmit(values.phone,values.password)}
                    >
                        {({ errors, touched}) =>
                            (<Form >
                                <div className={defaultModalStyles.modal__form_container}>
                                    <Field name="phone" placeholder={'Телефон'}/>
                                    {touched.phone && errors.phone ? (
                                        <p className={defaultModalStyles.error_message}>{errors.phone}</p>
                                    ) : null}
                                    <Field name="password" placeholder={'Пароль'} type={'password'}/>
                                    {touched.password && errors.password ? (
                                        <p className={defaultModalStyles.error_message}>{errors.password}</p>
                                    ) : null}
                                    <button type="submit" className={defaultModalStyles.modal__sendButton}>
                                        <p>Войти</p>
                                    </button>
                                </div>
                            </Form>)}
                    </Formik>

                    <div className={defaultModalStyles.modal__underLinks}>
                        <button onClick={changeModal}>
                            Войти с помощью смс
                        </button>
                        <button onClick={() => openModal(RegModal)}>
                            Регистрация
                        </button>
                    </div>
                    <button className={defaultModalStyles.modal__enterForPartnersButton}>
                        Вход для партнёров
                    </button>
                </div>
        </ModalTemplate>
    )});