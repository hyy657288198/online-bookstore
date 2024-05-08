import styles from '@/styles/loginstyle.module.css';
import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Card, message } from 'antd';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/router'
import Cookies from "js-cookie";
import {serverUrl} from "@/util/serverUrl";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinishLogin = async (values: any) => {
    setLoading(true);

    try {
      const response = await fetch(serverUrl + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log(userData)
        message.success('Login successful');
        Cookies.set('user', JSON.stringify(userData));
        await router.push("/search");
      } else {
          if (response.status === 403) {
              const errorMessage = await response.text();
              console.error('Deactivated account:', errorMessage);
              message.error('Account is deactivated. Please contact the site administrator.');
          } else {
              message.error('Invalid email or password');
          }
      }
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'DeactivatedError') {
                console.error('Deactivated account:', error.message);
            } else {
                console.error('Unexpected error:', error);
            }
        }

    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={styles.logincard}>
      <h2 className={styles.title}>LOG IN</h2>
      <Divider className={styles.divider} />
      <Form name="normal_login" initialValues={{ remember: true }} onFinish={onFinishLogin}>
        <Form.Item name="email" rules={[{ required: true, message: 'Please input your Email!' }]}>
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
          <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.loginformbutton} loading={loading}>
            Log in
          </Button>
          Or <Button type="link" href="/signup">
            register now!
          </Button>
        </Form.Item>
      </Form>
      <Divider className={styles.googledivider} style={{ borderColor: 'black' }}>
        Third Party
      </Divider>
      <div className={styles.google}>
        <GoogleLogin
            onSuccess={async () => {
                window.location.href = serverUrl + '/auth/google/callback';
            }}
            onError={() => {
              console.log('Login Failed');
            }}
        />
      </div>
    </Card>
  );
}
