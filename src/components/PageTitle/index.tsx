'use client';
import React from 'react';
import styles from '@/styles/layoutstyle.module.css';

const pageTitle: React.FC = () => {
    const currentURL = window.location.pathname;
    let pageName;
    if(currentURL=='/'){
        pageName = "home";
    } else {
        pageName = currentURL.replace(/[\/_]/g, ' ');
    }

    return (
        <p className={styles.pageTitle}>{pageName} Page</p>
    )
}
export default pageTitle;