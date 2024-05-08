'use client';
import React from 'react';
import {Button, Dropdown, MenuProps} from 'antd';
import { SettingOutlined, DownOutlined, PoweroffOutlined, UserOutlined, FileTextOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import styles from '@/styles/layoutstyle.module.css';
import Cookies from 'js-cookie';

export default function DisplayDropdownMenu() {
    function handleLogOut() {
        const userData: string | never[] = [];
        Cookies.set('user', JSON.stringify(userData));
    }
    const user_items: MenuProps['items'] = [
        {
            label: (
                <a href={"/user"}>
                    User File
                </a>
            ),
            key: "user",
            icon: <UserOutlined />
        },
        {
            label: (
                <a href={"/order"}>
                    Orders
                </a>
            ),
            key: "order",
            icon: <FileTextOutlined />
        },
        {
            label: (
                <a href={"/"} onClick={handleLogOut}>
                    Log Out
                </a>
            ),
            key: "logout",
            danger: true,
            icon: <PoweroffOutlined />
        }
    ];


    if (typeof window !== 'undefined') {
        const userCookie = Cookies.get('user');
        if (userCookie && userCookie.length > 2 && userCookie.length !== 0) {
            const userData = JSON.parse(userCookie);
            if (userData.is_admin) {
                user_items.unshift({
                    label: (
                        <a href={"/manage"}>
                            Manage
                        </a>
                    ),
                    key: "manage",
                    icon: <SettingOutlined />
                });
            }
            return (
                <div className={styles.userBar}>
                    <Button type={"link"} href={"/shopping_cart"} className={styles.shoppingCartBtn}>
                        <ShoppingCartOutlined /> Cart
                    </Button>
                    <Dropdown menu={{ items: user_items }} className={styles.login}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space style={{ color: "white" }}>
                                Hello, {userData.username}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            );
        } else {
            return <></>;
        }
    } else {
        return <></>;
    }
}
