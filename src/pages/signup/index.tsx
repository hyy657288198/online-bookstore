import Head from 'next/head'
import styles from '@/styles/signup.module.css';
import React from 'react';
import { useRouter } from 'next/router'
import {
    Button,
    Checkbox,
    Form,
    Input,
    message
} from 'antd';
import {serverUrl} from "@/util/serverUrl";

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
    }
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0
        },
        sm: {
            span: 16,
            offset: 8
        }
    }
};


export default function Home() {
    const [form] = Form.useForm();
    const router = useRouter();

    const onFinish = async (values: any) => {
        try {
          // Make a POST request to your backend register API
          const response = await fetch(serverUrl + '/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
    
          if (response.ok) {
            message.success('Registration successful. The verification email has been sent. Please check your inbox and click the link to confirm. ');
            await router.push("/");
          } else {
            const errorText = await response.text();
            if (errorText === 'Email already exists') {
              message.error('Email already exists');
            } else {
              message.error(errorText || 'Registration failed');
            }
          }
        } catch (error) {
          console.error('Error registering user:', error);
          message.error('Internal Server Error');
        }
      };

  return (
    <>
        <Head>
            <title>Book Store - Register</title>
            <meta name="description" content="Book store" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
          <div className={styles.register}>
              <Form
                  {...formItemLayout}
                  form={form}
                  name="register"
                  onFinish={onFinish}
                  className={styles.registerform}
                  size={"large"}
                  scrollToFirstError
              >
                  <Form.Item name="title">
                      <div className={styles.registerTitle}>
                          <h2>Register</h2>
                      </div>
                  </Form.Item>
                  <Form.Item
                      name="email"
                      label="E-mail"
                      rules={[
                          {
                              type: 'email',
                              message: 'The input is not a valid E-mail!',
                          },
                          {
                              required: true,
                              message: 'Please input your E-mail!',
                          },
                          {
                              pattern: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/,
                              message: 'Please enter a valid email address!',
                          },
                      ]}
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
                          {
                              min: 8,
                              message: 'Password must be at least 8 characters!',
                          },
                          {
                              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/,
                              message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character!',
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

                  <Form.Item
                      name="username"
                      label="Userame"
                      rules={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}
                  >
                      <Input />
                  </Form.Item>
                  <Form.Item
                      name="agreement"
                      valuePropName="checked"
                      rules={[
                          {
                              validator: (_, value) =>
                                  value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                          },
                      ]}
                      {...tailFormItemLayout}
                  >
                      <Checkbox>
                          I have read the <a href="">agreement</a>
                      </Checkbox>
                  </Form.Item>
                  <Form.Item {...tailFormItemLayout}>
                      <Button type="primary" htmlType="submit">
                          Register
                      </Button>
                  </Form.Item>
              </Form>
          </div>
    </>
  )
}