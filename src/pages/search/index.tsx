'use client';

import Head from 'next/head'
import styles from '@/styles/searchstyle.module.css';
import {Layout, Input, message} from 'antd';
import React, { useState } from 'react';
import Siderbar from "@/components/Siderbar";
const Booktable = dynamic(() => import("@/components/Booktable"), {
    ssr: false,
});
const Booklisttable = dynamic(() => import("@/components/Booklisttable"), {
    ssr: false,
});
import dynamic from "next/dynamic";
import {serverUrl} from "@/util/serverUrl";

const { Search } = Input;

export default function Home() {

    const [sidebarValue, setSidebarValue] = useState<string>('book'); // Assuming 'book' is the default value
    const [filter, setFilter] = useState<string[]>([]);
    const handleSidebarChange = (newValue:any) => {
        setSidebarValue(newValue);
    };
    const Display = () => {
        if(sidebarValue=='book'){
            return <Layout className={styles.layout2}>
                <div className={styles.searchBar}>
                    <Search
                        placeholder="input search text"
                        allowClear
                        enterButton="Search"
                        onSearch={handleSearch}
                    />
                </div>
                <div className={styles.booklist}>
                    <Booktable/>
                </div>
            </Layout>
        } else {
            return <Layout className={styles.layout2}>
                <div className={styles.booklist}>
                    <Booklisttable/>
                </div>
            </Layout>
        }
    }

    let bookData;

    const [loading, setLoading] = useState(false);

    const handleSearch = async (value: any) => {
        setLoading(true);

        try {
            const response = await fetch(serverUrl + '/book/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ q:value, filter }),
            });
            if (response.ok) {
                bookData = await response.json();
                message.success('Search successful');
                sessionStorage.setItem('book', JSON.stringify(bookData));
            } else {
                message.error('Invalid searching');
            }
        } catch (error) {
            console.error('Error search:', error);
            message.error('Internal Server Error');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (checkedValues: any) => {
        setFilter(checkedValues);
    };


  return (
    <>
        <Head>
            <title>Book Store - Search</title>
            <meta name="description" content="Book store" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
          <Layout className={styles.layout1}>
              <Siderbar onRadioChange={handleSidebarChange} onCheckboxChange={handleCheckboxChange}/>
              <Display/>
          </Layout>
    </>
  )
}
