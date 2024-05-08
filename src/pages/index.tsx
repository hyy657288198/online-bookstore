'use client';

import Head from 'next/head'
import main_styles from '@/styles/main.module.css';
import styles from '@/styles/homepage.module.css';
import React from 'react';
import dynamic from 'next/dynamic';
import Login from "@/components/Login";

const ParticlesBg = dynamic(
    () => import("particles-bg"),
    { ssr: false }
)

export default function Home() {

    return (
        <>
            <Head>
                <title>Book Store</title>
                <meta name="description" content="Book store" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className={main_styles.main} >
                <div className={styles.home}>
                    <ParticlesBg type="polygon" num={8} bg={false} />
                    <div className={styles.welcome}>
                        <p className={styles.p}>Welcome to Book Store!</p>
                        <p className={styles.p}>We have countless books,</p>
                        <p className={styles.p}>and you can always find </p>
                        <p className={styles.p}>what you like here.</p>
                        <p className={styles.p}>You can buy them, </p>
                        <p className={styles.p}>or create a book list</p>
                        <p className={styles.p}>for your favourite books,</p>
                        <p className={styles.p}>and then write down your feelings</p>
                        <p className={styles.p}>and share them with others!</p>
                        <p className={styles.p}>Looking forward to your joining!</p>

                    </div>
                    <div className={styles.login}>
                        <Login/>
                    </div>
                </div>
            </main>
        </>
    )
}

