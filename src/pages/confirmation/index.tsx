import Head from 'next/head'
import styles from '@/styles/confirmation.module.css';
import React from 'react';
import { Button, Result } from 'antd';

export default function Home() {
  return (
    <>
        <Head>
            <title>Book Store - Confirmation</title>
            <meta name="description" content="Book store" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className={styles.main}>
          <Result
              status="success"
              title="Successfully Purchased!"
              subTitle={"Order has been placed."}
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
