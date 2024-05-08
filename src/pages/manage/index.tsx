'use client';

import React, {useEffect, useState, SetStateAction, Dispatch} from 'react';
import {Table, Switch} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from '@/styles/tablecontainer.module.css';
import Cookies from "js-cookie";
import {serverUrl} from "@/util/serverUrl";
import Head from "next/head";

interface DataType {
    key:string;
    username: string;
    email: string;
    is_active: boolean;
    is_admin: boolean;
}

async function fetchAllUsers(): Promise<DataType[]> {
    try {
        const userCookie = Cookies.get('user');
        if (userCookie && userCookie.length > 2 && userCookie.length !== 0) {
            const userData = JSON.parse(userCookie);

            return fetch(serverUrl + '/admin/getAllUsers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`,
                },
            })
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    const users: DataType[] = data.users;
                    return users;
                });
        } else {
            throw new Error('User cookie is missing or invalid');
        }
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
}



export default function Home() {
    const [activeSwitchStates, setActiveSwitchStates] = useState<boolean[]>([]);
    const [adminSwitchStates, setAdminSwitchStates] = useState<boolean[]>([]);
    const [data1, setData] = useState<DataType[]>([]);

    const columns: ColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'username',
            key: 'username',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'email',
            dataIndex: 'email',
            key: 'manage_page_email',
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (_, record, index) => (
                <Switch
                    checkedChildren={'active'}
                    unCheckedChildren={'inactive'}
                    checked={activeSwitchStates[index]}
                    onChange={(checked) => handleActiveSwitchChange(record, checked, index, setActiveSwitchStates)}
                />
            ),
        },
        {
            title: 'User Type',
            dataIndex: 'is_admin',
            key: 'is_admin',
            render: (_,record, index) => {
                return (
                    <Switch
                        checkedChildren={'manager'}
                        unCheckedChildren={'normal'}
                        checked={adminSwitchStates[index]}
                        onChange={(checked) => handleAdminSwitchChange(record, checked, index, setAdminSwitchStates)}
                    />
                );
            },
        },
    ];

    const handleAdminSwitchChange = async (
        record: DataType,
        checked: boolean,
        index: number,
        setSwitchStates: Dispatch<SetStateAction<boolean[]>>
    ) => {
        if (record.is_admin) {
            console.log("Cannot change user type when type is 'manager'");
            return;
        }

        try {
            const userCookie = Cookies.get('user');
            if (userCookie && userCookie.length > 2 && userCookie.length !== 0) {
                const userData = JSON.parse(userCookie);
                const response = await fetch(serverUrl + `/admin/user/${record.email}/grant-admin`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to update user type');
                }
                setSwitchStates((prevSwitchStates) => {
                    const newSwitchStates = [...prevSwitchStates];
                    if(!newSwitchStates[index]){
                        newSwitchStates[index] = checked;
                    }
                    return newSwitchStates;
                });
            }
        } catch (error) {
            console.error('Error updating user type:', error);
        }
    };

    const handleActiveSwitchChange = async (
        record: DataType,
        checked: boolean,
        index: number,
        setSwitchStates: Dispatch<SetStateAction<boolean[]>>
    ) => {
        try {
            const userCookie = Cookies.get('user');
            if (userCookie && userCookie.length > 2 && userCookie.length !== 0) {
                const userData = JSON.parse(userCookie);
                const response = await fetch(serverUrl + `/admin/user/${record.email}/activate`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to update user type');
                }
                setSwitchStates((prevSwitchStates) => {
                    const newSwitchStates = [...prevSwitchStates];
                    newSwitchStates[index] = checked;
                    return newSwitchStates;
                });
            }
        } catch (error) {
            console.error('Error updating user type:', error);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchAllUsers();
                setData(result);
                setAdminSwitchStates(result.map((user) => user.is_admin));
                setActiveSwitchStates(result.map((user) => user.is_active));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


        return (
            <>
                <Head>
                    <title>Book Store - Manage</title>
                    <meta name="description" content="Book store" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <div className={styles.table}>
                    <Table columns={columns} dataSource={data1} scroll={{y:420}}/>
                </div>
            </>
    )
}

