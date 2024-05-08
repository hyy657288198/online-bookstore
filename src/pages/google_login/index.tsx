import Head from 'next/head'
import styles from '@/styles/confirmation.module.css';
import React from 'react';
import {Button, message, Result} from 'antd';
import {serverUrl} from "@/util/serverUrl";
import Cookies from "js-cookie";

export default function Home() {

    try {
        fetch(serverUrl + '/google_login', {
            credentials: 'include'
        }).then(response => response.json())
            .then(userData => {
                console.log(userData);
                message.success('Login successful');
                Cookies.set('user', JSON.stringify(userData));
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
  return (
    <>
        <Head>
            <title>Book Store - Successfully Logined</title>
            <meta name="description" content="Book store" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className={styles.main}>
          <Result
              status="success"
              title="Successfully Logined!"
              subTitle={"Login Successful! Welcome to our platform. Your user data has been retrieved, and you are now logged in. Feel free to explore and navigate to the search page to discover more content."}
              className={styles.result}
              extra={[
                  <Button type="primary" key="console" href={"/search"}>
                      Go Back to Search Page
                  </Button>
              ]}
          />
        </div>
    </>
  )
}
