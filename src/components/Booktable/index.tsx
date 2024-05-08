import {InputNumber, Button, Space, Table, TableColumnsType, Image, Tag, Tooltip} from "antd";
import React, { useState } from "react";
import {ShoppingCartOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
const AddtolistModal = dynamic(() => import("@/components/AddtolistModal"), {
    ssr: false,
});
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import {serverUrl} from "@/util/serverUrl";

interface DataType {
    key: string;
    item:string;//book cover - items:volumeInfo:imageLinks
    name: string;//book name - items:volumeInfo:title
    author: string[];//authors - items:volumeInfo:authors
    infoLink: string;
}

interface ExpandedDataType {
    key: string;
    description: string;//descriotion - items:volumeInfo:descriotion
    num_of_pages: number;//items:volumeInfo:
    publisher:string;//items:volumeInfo:publisher
    publication_time: string;//items:volumeInfo:publishedDate
    field: string[];//items:volumeInfo:category
    price: number;//price - items:saleInfo:listPrice:amount
}

function UseTooltip(text:String){
    return <Tooltip title={text} placement="topLeft">
        {text}
    </Tooltip>
}

function UseTag(text:String){
    return (
        <Tag>{text}</Tag>
    );
}

const COLUMNS: ColumnsType<DataType> = [
    {
        title: 'Item',
        dataIndex: 'item',
        key: 'item',
        width:"20%",
        render: (_, { item }) => (
            <>
                <Image src={item} alt={'cover'}/>
            </>
        ),
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width:"20%"
    },
    {
        title: 'Authors',
        dataIndex: 'author',
        key: 'author',
        width:"24%",
        ellipsis: true,
        render: (text: string) => {
            return UseTooltip(text);
        }
    }
];


export default function Booktable() {
    const [quantity, setQuantity] = useState(1);
    const storedBookData = sessionStorage.getItem('book');

    let bookData;
    if (storedBookData) {
        bookData = JSON.parse(storedBookData);
    }

    const handleAddToCart = (record:any) => {
        const userCookie = Cookies.get('user');
        let userData;
        if(userCookie && userCookie.length > 2 && userCookie.length !== 0){
            userData = JSON.parse(userCookie);
        }
        const bookInfo = {
            bookId: record.key,
            bookName: record.name,
            bookAuthor: record.author,
            bookCover: record.item,
            bookPrice: record.subtable.price,
            quantity: quantity,
        };
        fetch(serverUrl + '/carts/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`,
            },
            body: JSON.stringify(bookInfo),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        setQuantity(1);
    }

    const columns = [...COLUMNS,
        {
            title: '',
            key: 'action',
            width: "15%",
            render: (_: any, record: DataType) => (
                <Button type={"link"}
                        href={record.infoLink}>
                    View
                </Button>
            ),
        },
    ]

    const userCookie = Cookies.get('user');
    if(userCookie && userCookie.length > 2 && userCookie.length !== 0){
        columns.push({
            title: '',
            key: 'add',
            width: "20%",
            render: (_: any, record: DataType) => (
                <Space size="middle" direction={"vertical"} style={{alignItems: "center"}}>
                    <InputNumber
                        min={1}
                        value={quantity}
                        onChange={(value) => setQuantity(value ?? 1)}
                    /><Button onClick={() => handleAddToCart(record)}>Shop <ShoppingCartOutlined/></Button>
                    <AddtolistModal record={record} name={""}/>
                </Space>
            ),
        })
    }

    const ExpandedTable = (subtable:any) => {

        const columns: TableColumnsType<ExpandedDataType> = [
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
                ellipsis: true,
                width: "20%",
                render: (text: string) => {
                    return UseTooltip(text);
                }
            },
            {
                title: 'Number of pages',
                dataIndex: 'num_of_pages',
                key: 'num_of_pages',
                width: "15%"
            },
            {
                title: 'Publisher',
                dataIndex: 'publisher',
                key: 'publisher',
                width: "15%",
                ellipsis: true,
                render: (text: string) => {
                    return UseTooltip(text);
                }
            },
            {
                title: 'Publication time',
                dataIndex: 'publication_time',
                key: 'publication_time',
                width: "15%",
            },
            {
                title: 'Field',
                dataIndex: 'field',
                key: 'field',
                width: "20%",
                render: (_, {field}) => (
                    <>
                        {Array.isArray(field) && field.map((i) => {
                            return UseTag(i);
                        })}
                    </>
                ),
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                width: "10%",
                render: (price: number) => {
                    return <p>{price} CAD</p>
                }
            }
        ];

        const data: ExpandedDataType[] = [subtable.subtable];
        return <Table columns={columns} dataSource={data} pagination={false}/>;
    };

    const expandedRowRender = (record: any) => {
        return <ExpandedTable subtable={record.subtable} />;
    };

    return (
        <Table columns={columns} expandable={{expandedRowRender, defaultExpandedRowKeys: ['0']}} dataSource={bookData}
               scroll={{y: 400}}/>
    )
}
