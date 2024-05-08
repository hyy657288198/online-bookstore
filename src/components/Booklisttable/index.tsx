import {Button, Image, Space, Table, TableColumnsType, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
const AddReviewModal = dynamic(() => import("@/components/AddReviewModal"), {
    ssr: false,
});
import {ColumnsType} from "antd/es/table";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import {router} from "next/client";
import {serverUrl} from "@/util/serverUrl";

export interface DataType {
    list_name: string;//list name
    user_email: string;
    modified_at: string;
    subtable:{
        book_name: string[];
        book_id: string[];
        book_cover: string[];
        book_author: string[];
    }
}

export interface SubDataType {
    book_name: string;
    book_cover: string;
    book_author: string;
    book_id: string;
}

function UseTooltip(text:String){
    return <Tooltip title={text} placement="topLeft">
        {text}
    </Tooltip>
}

const COLUMNS: ColumnsType<DataType> = [
    {
        title: 'List Name',
        dataIndex: 'list_name',
        key: 'list_name',
        ellipsis: true,
        render: (text: string) => {
            return UseTooltip(text);
        }
    },
    {
        title: 'Creator',
        dataIndex: 'user_email',
        key: 'user_email',
        ellipsis: true,
        render: (text: string) => {
            return UseTooltip(text);
        }
    },
    {
        title: 'Modified Time',
        dataIndex: 'modified_at',
        key: 'modified_at',
        ellipsis: true,
        render: (text: string) => {
            return UseTooltip(text);
        }
    }
];

export default function Booklisttable() {

    const [booklists, setBooklists] = useState<DataType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await fetch(serverUrl + '/booklists/allBooklist');
                const data = await response.json();

                if (response.ok) {
                    setBooklists(data.booklists);
                } else {
                    console.error('Failed to fetch booklists:', data.error);
                }
            } catch (error) {
                console.error('Error fetching booklists:', error);
            }
        };

        fetchData();
    }, []);

    const ExpandedTable = (subtable:any) => {

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
        const data: SubDataType[] = [];
        for (let i = 0; i < subtable.subtable.book_name.length; ++i) {
            data.push({
                book_author: subtable.subtable.book_author[i],
                book_cover: subtable.subtable.book_cover[i],
                book_name: subtable.subtable.book_name[i],
                book_id: subtable.subtable.book_id[i]
            });
        }
        return <Table columns={columns} dataSource={data}/>;
    };

    const expandedRowRender = (record: any) => {
        return <ExpandedTable subtable={record.subtable} />;
    };

    const handleClick = async (record: DataType) => {
        Cookies.set('list', JSON.stringify(record));
        await router.push("/booklist");
    }

    const columns = [...COLUMNS,
        {
            title: 'Number of Books',
            dataIndex: 'num_of_books',
            key: 'num_of_books',
            render: (_: any, record: DataType) => (
                <p>{record.subtable.book_name.length}</p>
            ),
        },
        {
            title: '',
            key: 'action',
            width: "15%",
            render: (_: any, record: DataType) => (

                <Button type={"link"}
                        onClick={()=>handleClick(record)}>
                    View
                </Button>
            ),
        },
    ]

    const userCookie = Cookies.get('user');
    if(userCookie && userCookie.length > 2 && userCookie.length !== 0){
        columns.push({
            title: '',
            key: 'addReview',
            width:"20%",
            render: (_: any, record: DataType) => (
                <Space size="middle" direction={"vertical"} style={{alignItems:"center"}}>
                    <AddReviewModal record={record}/>
                </Space>
            ),
        })
    }

  return (
      <Table columns={columns} expandable={{ expandedRowRender }} dataSource={booklists} scroll={{y:400}} />
  )
}
