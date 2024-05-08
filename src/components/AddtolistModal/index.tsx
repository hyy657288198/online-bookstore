import { Button, Select, Form, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import BooklistModal from '@/components/BooklistModal';
import styles from '@/styles/addtolistModal.module.css';
import Cookies from 'js-cookie';
import {serverUrl} from "@/util/serverUrl";

interface DataType {
    key: string;
    item: string; // book cover - items:volumeInfo:imageLinks
    name: string; // book name - items:volumeInfo:title
    author: string[]; // authors - items:volumeInfo:authors
    infoLink: string;
}

interface AddtolistModalProps {
    name: string;
    record?: DataType;
}

export default function AddtolistModal(record: AddtolistModalProps) {
    interface BooklistType {
        list_name: string;
    }

    const [booklists, setBooklists] = useState<BooklistType[]>([]);
    const [visible, setVisiable] = useState(false);
    const [form] = Form.useForm();
    const [selectKey, setSelectKey] = useState(0); // Add a state for the key

    useEffect(() => {
        const fetchUserBooklists = async () => {
            try {
                const userCookie = Cookies.get('user');
                let userData;
                if (userCookie && userCookie.length > 2 && userCookie.length !== 0) {
                    userData = JSON.parse(userCookie);

                    const response = await fetch(serverUrl + `/booklists/booklistName`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userData.token}`, // Include JWT token in the headers
                        },
                    });
                    const data = await response.json();

                    if (response.ok) {
                        setBooklists(data.booklists.rows);
                    } else {
                        console.error('Failed to fetch user booklists:', data.error);
                    }
                }
            } catch (error) {
                console.error('Error fetching user booklists:', error);
            }
        };

        fetchUserBooklists();
    }, []); // Add visible to the dependency array

    const open = () => {
        setVisiable(true);
    };

    const close = () => {
        setVisiable(false);
    };

    const submit = () => {
        form.submit();
        close();
    };

    let selectedValue: string = '';

    const onSubmit = async () => {
        const info = {
            listName: selectedValue,
            author: record.record?.author,
            cover: record.record?.item,
            bookId: record.record?.key,
            bookName: record.record?.name,
        };

        try {
            const userCookie = Cookies.get('user');
            let userData;
            if (userCookie && userCookie.length > 2 && userCookie.length !== 0) {
                userData = JSON.parse(userCookie);
                const response = await fetch(serverUrl + `/booklists/add-book`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`,
                    },
                    body: JSON.stringify(info),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log(data.message);
                } else {
                    console.error('Failed to add book to booklists:', data.error);
                }
            }
        } catch (error) {
            console.error('Error adding book to booklists:', error);
        }
        form.resetFields();
    };

    const items = booklists.map((booklist) => ({
        label: booklist.list_name,
        value: booklist.list_name,
    }));

    const handleChange = (value: string) => {
        selectedValue = value;
    };

    return (
        <div>
            <Button onClick={open}>Add to List</Button>
            <Modal
                wrapClassName="modal-wrap"
                okText="Submit"
                cancelButtonProps={{ shape: 'round' }}
                okButtonProps={{ shape: 'round' }}
                width={600}
                open={visible}
                title="Choose your booklist"
                onCancel={close}
                onOk={submit}
            >
                <div className="form">
                    <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={onSubmit}>
                        <Form.Item name="addtolist" key={selectKey.toString()}>
                            <div>
                                <Select
                                    placeholder={'select your booklist'}
                                    key={selectKey.toString()}
                                    style={{ width: 180 }}
                                    onChange={handleChange}
                                    options={items}
                                    className={styles.choose}
                                />
                                <h3 className={styles.or}>OR</h3>
                                <BooklistModal name={'Add A New List'} onClose={close} />
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    );
}
