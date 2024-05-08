'use client';

import { Button, Layout, Tag, Tooltip, Form, Input, Modal} from 'antd';
import React, { useState }  from 'react';
import styles from "@/styles/usersider.module.css";
import {EditOutlined} from '@ant-design/icons';
import Cookies from "js-cookie";

const { Sider } = Layout;

export default function ReviewSiderbar() {

    const [visiable, setVisiable] = useState(false);
    const [form] = Form.useForm();
    const open = () => {
        setVisiable(true);
    };
    const close = () => {
        setVisiable(false);
    };
    const submit = ()=>{
        form.submit()
    }
    const onSubmit = () =>{
        form.resetFields();
        close()
    }

    const userCookie = Cookies.get('user');
    let userData;
    if(userCookie){
        userData = JSON.parse(userCookie);
    }

    return (
          <Sider  width={"250px"} className={styles.userSider}>
              <div className={styles.userInfoContainer}>
                  <h3 className={styles.userTitle}>User Info</h3>
                  <p className={styles.userInfo}>Name: {userData.username}</p>
                  <p className={styles.userInfo}>E-mail: {userData.email}</p>
                  <p className={styles.userInfo}>Password: ********</p>
                  <p className={styles.userInfo}>Status: <Tag color={"green"}>active</Tag></p>
                  <div className={styles.edit}>
                      <Tooltip title="Edit My Information">
                          <Button type="primary" icon={<EditOutlined />} onClick={open}>Edit</Button>
                      </Tooltip>
                      <Modal
                          wrapClassName="modal-wrap"
                          okText="Submit"
                          cancelButtonProps={{ shape: 'round' }}
                          okButtonProps={{ shape: 'round' }}
                          width={600}
                          open={visiable}
                          title="Update My Information"
                          onCancel={close}
                          onOk={submit}
                      >
                          <div className="form">
                              <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={onSubmit}>
                                  <Form.Item
                                      label="Name"
                                      name="username"
                                      rules={[{ required: true, message: 'Please input  username!' }]}
                                  >
                                      <Input />
                                  </Form.Item>
                                  <Form.Item
                                      name="password"
                                      label="Password"
                                      rules={[
                                          {
                                              required: true,
                                              message: 'Please input your password!',
                                          },
                                      ]}
                                      hasFeedback
                                  >
                                      <Input.Password />
                                  </Form.Item>

                                  <Form.Item
                                      name="confirm"
                                      label="Confirm Password"
                                      dependencies={['password']}
                                      hasFeedback
                                      rules={[
                                          {
                                              required: true,
                                              message: 'Please confirm your password!',
                                          },
                                          ({ getFieldValue }) => ({
                                              validator(_, value) {
                                                  if (!value || getFieldValue('password') === value) {
                                                      return Promise.resolve();
                                                  }
                                                  return Promise.reject(new Error('The new password that you entered do not match!'));
                                              },
                                          }),
                                      ]}
                                  >
                                      <Input.Password />
                                  </Form.Item>
                              </Form>
                          </div>
                      </Modal>
                  </div>
              </div>
          </Sider>
      )
}
