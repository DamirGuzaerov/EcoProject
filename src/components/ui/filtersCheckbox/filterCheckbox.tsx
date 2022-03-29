import {FC, useEffect, useState} from "react";
import styles from './filterCheckbox.module.sass';
import  './filterCheckbox.module.sass';
import Icon from "../icon/icon";

interface name {
    name: string,
    onChange: Function,
    flag: boolean
}
export const FilterCheckbox:FC<name> = ({name, onChange, flag}) => {
    const [isChecked, setIsChecked] = useState(flag);

    const onCheck = () => {
        setIsChecked(!isChecked);
        console.log(isChecked);
    }

    useEffect(() => {
        onChange(isChecked);
    }, [isChecked]);

    return(
        <div className={styles.checkboxWithName}>
            <label className={styles.checkbox_wrapper}>
                <input type={'checkbox'} onChange={onCheck}/>
                <span className={`${styles.checkbox} ${isChecked ? styles.checkbox_active : 'checkboxDisabled'}`}>
                    <Icon name={'checkbox_svg'} width={12} height={9}/>
                </span>
            </label>
            <p className={`${styles.default_name} ${isChecked ? styles.active_name: 'disabledName'}`}>{name}</p>
        </div>
    )
}