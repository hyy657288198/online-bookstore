import Head from 'next/head'
import styles from '@/styles/tablecontainer.module.css';
import OrderTable from "@/components/Ordertable";
import React from "react";

export default function Home() {
    return (
        <>
                <Head>
                    <title>Book Store - Orders</title>
                    <meta name="description" content="Book store" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <div className={styles.table}>
                    <OrderTable/>
                </div>
        </>
    )
}
