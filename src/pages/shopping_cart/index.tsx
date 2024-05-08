'use client';

import Head from 'next/head'
import styles from '@/styles/shoppingcart.module.css';
import layoutstyles from '@/styles/searchstyle.module.css';
import { Layout } from "antd";
import React, {useState} from "react";
const Checkout = dynamic(() => import("@/components/Checkout"), {
    ssr: false,
});
import dynamic from "next/dynamic";
const ShoppingCartTable = dynamic(() => import("@/components/Shoppingcarttable"), {
    ssr: false,
});

export default function Home() {
    const [total, setTotal] = useState<number>(0);

    const handleTotalChange = (newTotal: number) => {
        setTotal(parseFloat(newTotal.toFixed(2)));
    };

  return (
    <>
        <Head>
            <title>Book Store - Shopping Cart</title>
            <meta name="description" content="Book store" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
          <Layout className={layoutstyles.layout1}>
              <Checkout/>
              <Layout className={layoutstyles.layout2}>
                  <div className={styles.tableDiv}>
                      <ShoppingCartTable haveButton={true} onTotalChange={handleTotalChange}/>
                  </div>
                  <div>
                      <div className={styles.total}>Total: {total} CAD</div>
                  </div>
              </Layout>
          </Layout>
    </>
  )
}
