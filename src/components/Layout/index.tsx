'use client';
import React, {ReactNode} from 'react';
import {Button, Layout as Antd_Layout} from 'antd';
import { SearchOutlined, BookOutlined } from '@ant-design/icons';
import styles from '@/styles/layoutstyle.module.css';
import dynamic from "next/dynamic";
const PageTitle = dynamic(() => import("@/components/PageTitle"), {
    ssr: false,
});
const DisplayDropdownMenu = dynamic(() => import("@/components/DisplayDropdownMenu"), {
    ssr: false,
});


const { Header, Content, Footer } = Antd_Layout;

interface Props {
    children?: ReactNode
}

export default function Layout({children}:Props) {

    return (
        <Antd_Layout>
            <Header className={styles.header}>
                <div className={styles.demoLogo} ><a href={"/"}><BookOutlined /> Book Store</a></div>
                <DisplayDropdownMenu/>
            </Header>
            <div className={styles.searchButton}>
                <Button type={"link"} size={"large"} href={"/search"}> <SearchOutlined /> Search Page</Button>
                <PageTitle/>
            </div>
            <Content style={{ padding: '0 50px'}}>
                <Antd_Layout className={styles.antd_layout}>
                    <Content className={styles.content}>
                        {children}
                    </Content>
                </Antd_Layout>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Data Comes From Google Books</Footer>
        </Antd_Layout>
    )
}
