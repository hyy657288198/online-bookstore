'use client';
import {Button, Form, Input, Modal} from 'antd';
import React, {useState} from 'react';
import {DataType} from "@/components/Booklisttable"
import Cookies from "js-cookie";
import {serverUrl} from "@/util/serverUrl";

interface AddReviewModalProps {
    record?: DataType;
}

export default function AddReviewModal({record}:AddReviewModalProps) {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();

    const open = () => {
        setVisible(true);
    };

    const close = () => {
        setVisible(false);
    };

    const submit = () => {
        form.submit();
    };

    const onSubmit = async (values: any) => {
        try {

            let userData;
            const userCookie = Cookies.get('user');
            if(userCookie){
                userData = JSON.parse(userCookie);
            }

            const listName = record?.list_name;
            const content = values.write_review;

            const response = await fetch(serverUrl + `/booklists/${listName}/add-comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`,
                },
                body: JSON.stringify({ content }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Comment added successfully. Comment ID:', data.commentId);
            } else {
                console.error('Error adding comment:', data.error);
            }

            form.resetFields();
            close();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div>
            <Button onClick={open}>
                Add Review
            </Button>
            <Modal
                wrapClassName="modal-wrap"
                okText="Submit"
                cancelButtonProps={{ shape: 'round' }}
                okButtonProps={{ shape: 'round' }}
                width={600}
                open={visible}
                title="Write A Review"
                onCancel={close}
                onOk={submit}
            >
                <div className="form">
                    <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={onSubmit}>
                        <Form.Item
                            label="Your Review"
                            name="write_review"
                            rules={[{ required: true, message: 'Please write a review for this book list!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
      )
}
