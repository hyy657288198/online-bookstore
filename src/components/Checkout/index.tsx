import React, { useState } from 'react';
import { Layout } from 'antd';
import styles from '@/styles/checkout.module.css';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import {serverUrl} from "@/util/serverUrl";
const { Sider } = Layout;

const Input = (props: any) => (
    <div className={styles.input}>
        <label>{props.label}</label>
        <div className={styles.inputField}>
            <input
                type={props.type}
                name={props.name}
                className={styles.inputNoArrow}
                onChange={props.onChange}
                value={props.value}
            />
            <img src={props.imgSrc} alt={''} />
        </div>
    </div>
);

const Button = (props: any) => (
    <a>
        <button className={styles.checkoutBtn} onClick={props.onClick} type="button" disabled={props.disabled}>
            {props.text}
        </button>
    </a>
);

export default function Checkout() {
    const [cardholderName, setCardholderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expDate, setExpDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const router = useRouter();

    function handleCheckOut(userData: any, setButtonDisabled: (disabled: boolean) => void) {
        fetch(serverUrl + '/orders/place-order', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(async data => {
                console.log('Success', data);
                await router.push('/confirmation');
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                setButtonDisabled(false);
            });
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case 'name':
                setCardholderName(value);
                break;
            case 'card_number':
                setCardNumber(value);
                break;
            case 'exp_date':
                setExpDate(value);
                break;
            case 'cvv':
                setCvv(value);
                break;
            default:
                break;
        }
    };

    const handlePlaceOrder = () => {
        setButtonDisabled(true);

        const isValidInput =
            cardholderName.trim().length > 0 &&
            cardNumber.length === 16 &&
            expDate.trim().length > 0 &&
            cvv.length === 3;

        if (isValidInput) {
            const userCookie = Cookies.get('user');
            if (userCookie && userCookie.length > 2 && userCookie.length !== 0) {
                const userData = JSON.parse(userCookie);
                handleCheckOut(userData, setButtonDisabled);
            }
        } else {
            setButtonDisabled(false);
        }
    };

    return (
        <Sider width={'250px'}>
            <div className={styles.checkout}>
                <div className={styles.checkoutContainer}>
                    <h3 className={styles.title}>Credit card <br/>checkout</h3>
                    <Input label="Cardholder's Name" type="text" name="name" onChange={handleInputChange} value={cardholderName} />
                    <Input
                        label="Card Number"
                        type="number"
                        name="card_number"
                        imgSrc="https://seeklogo.com/images/V/visa-logo-6F4057663D-seeklogo.com.png"
                        onChange={handleInputChange}
                        value={cardNumber}
                    />
                    <div className="row">
                        <div className="col">
                            <Input label="Expiration Date" type="month" name="exp_date" onChange={handleInputChange} value={expDate} />
                        </div>
                        <div className="col">
                            <Input label="CVV" type="number" name="cvv" onChange={handleInputChange} value={cvv} />
                        </div>
                    </div>
                    <Button text="Place order" onClick={handlePlaceOrder} disabled={buttonDisabled} />
                </div>
            </div>
        </Sider>
    );
}