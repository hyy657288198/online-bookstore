'use client';

import {Button, Form, Input, message, Modal} from 'antd';
import React, {useState} from 'react';
import styles from "@/styles/user.module.css";
import Cookies from "js-cookie";
import {router} from "next/client";
import {serverUrl} from "@/util/serverUrl";

type Props = {
    name?: string;
    onClose: () => void;
}

export default function BooklistModal(data:Props) {

    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();

    const open = () => {
        setVisible(true);
    };

    const close = () => {
        setVisible(false);
        data.onClose();
    };

    const submit = () => {
        form.submit();
    };

    const onSubmit = async (values: any) => {
        try {
            const listName = values.listname;
            const userCookie = Cookies.get('user');
            let userData;
            let userEmail;
            if(userCookie){
                userData = JSON.parse(userCookie);
                userEmail = userData.email;
            }

            //create booklist
            if(listName){
                const response = await fetch(serverUrl + `/booklists/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`,
                    },
                    body: JSON.stringify({listName}),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Booklist created successfully. ');
                    router.reload();
                } else {
                    if(data.error === 'This name exists.'){
                        message.error('This name exists.')
                    } else if(data.error === 'Reach the limit of booklists. Please remove some booklist first.'){
                        message.error('Reach the limit of booklists. Please remove some booklists first.')
                    }
                    console.error('Error creating booklist:', data.error);

                }
            }

            form.resetFields();
            close();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div>
            <Button type={"primary"} className={styles.addButton} onClick={open}>
                {data.name}
            </Button>
            <Modal
                wrapClassName="modal-wrap"
                okText="Submit"
                cancelButtonProps={{ shape: 'round' }}
                okButtonProps={{ shape: 'round' }}
                width={600}
                open={visible}
                title="Create New List"
                onCancel={close}
                onOk={submit}
            >
                <div className="form">
                    <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={onSubmit}>
                        <Form.Item
                            label="List Name"
                            name="listname"
                            rules={[{ required: true, message: 'Please input a name for your book list!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="list_description"
                            >
                            <Input />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
      )
}
