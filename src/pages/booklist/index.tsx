import Head from 'next/head'
const ReviewSiderbar = dynamic(() => import("@/components/Reviewsider"), {
    ssr: false,
});
const RenderTable = dynamic(() => import("@/components/RenderTable"), {
    ssr: false,
});
import layoutstyles from "@/styles/searchstyle.module.css";
import {Layout} from "antd";
import styles from "@/styles/shoppingcart.module.css";
import React from "react";
import dynamic from "next/dynamic";

export default function Home() {

  return (
    <>
        <Head>
            <title>Book Store - Booklist</title>
            <meta name="description" content="Book store" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
          <Layout className={layoutstyles.layout1}>
              <ReviewSiderbar/>
              <Layout className={layoutstyles.layout2}>
                  <div className={styles.tableDiv}>
                      <RenderTable/>
                  </div>
              </Layout>
          </Layout>
    </>
  )
}
