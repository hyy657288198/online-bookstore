'use client';
import React from 'react';
import {Image, Table, TableColumnsType} from "antd";
import {SubDataType} from "@/components/Booklisttable";
import Cookies from "js-cookie";

const renderTable = () => {

    const columns: TableColumnsType<SubDataType> = [
        {
            title: 'Item',
            dataIndex: 'book_cover',
            key: 'book_cover',
            width:"20%",
            render: (_: any, {book_cover}: any) => (
                <>
                    <Image src={book_cover} alt={'cover'}/>
                </>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'book_name',
            key: 'book_name',
            width:"20%"
        },
        {
            title: 'Authors',
            dataIndex: 'book_author',
            key: 'book_author',
            width: '24%',
        }
    ];
    const listCookie = Cookies.get('list');
    let listData: any;
    if(listCookie){
        listData = JSON.parse(listCookie);
    }
    const data: SubDataType[] = listData?.subtable?.book_name
        ? listData.subtable.book_name.map((_: any, i: number) => ({
            book_author: listData.subtable.book_author[i],
            book_cover: listData.subtable.book_cover[i],
            book_name: listData.subtable.book_name[i],
            book_id: listData.subtable.book_id[i]
        }))
        : [];

    return <Table columns={columns} dataSource={data} scroll={{y:400}}/>;
}
export default renderTable;