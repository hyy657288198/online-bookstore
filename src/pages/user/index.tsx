import styles from "@/styles/user.module.css";
import {Button, Image, Layout, Space, Table, TableColumnsType, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import layoutstyles from "@/styles/searchstyle.module.css";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import {SubDataType} from "@/components/Booklisttable";
import {useRouter} from "next/router";
import {serverUrl} from "@/util/serverUrl";
import Head from "next/head";

const UserSiderbar = dynamic(() => import("@/components/Usersider"), {
    ssr: false,
});

interface BookListDataType {
    key: string;
    list_name: string; //list name
    modified_at: string;
}

const COLUMNS: ColumnsType<BookListDataType> = [
    {
        title: 'List Name',
        dataIndex: 'list_name',
        key: 'list_name',
        ellipsis: true,
        render: (text: string) => {
            return <Tooltip title={text} placement="topLeft">
                {text}
            </Tooltip>
        }
    },
    {
        title: 'Modified Time',
        dataIndex: 'modified_at',
        key: 'modified_at',
    },
];

export default function Home() {

    const router = useRouter();

    const [booklists, setBooklists] = useState<BookListDataType[]>([]);
    const userCookie = Cookies.get('user');
    let userData: { token: any; };
    if (userCookie && userCookie.length > 2 && userCookie.length !== 0) {
        userData = JSON.parse(userCookie);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(serverUrl + `/booklists/user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`, // Include JWT token in the headers
                    },
                });
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

    const ExpandedTable = (subtable: any) => {
        function handleBookRemove(record: SubDataType) {
            fetch(serverUrl + `/booklists/${subtable.subtable.list_name}/delete-book/${record.book_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`, // Include JWT token in the headers
                },
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(`Failed to delete book from booklist: ${response.status}`);
                    }
                })
                .then(data => {
                    console.log(data.message);
                    setBooklists(updatedBooklists => {
                        return updatedBooklists.map(list => {
                            if (list.list_name === subtable.subtable.list_name) {
                                return {
                                    ...list,
                                    modified_at: new Date().toISOString(),
                                };
                            }
                            return list;
                        });
                    });
                    router.reload();
                })
                .catch(error => {
                    console.error('Error deleting book from booklist:', error);
                });

        }

        const columns: TableColumnsType<SubDataType> = [
            {
                title: 'Item',
                dataIndex: 'book_cover',
                key: 'book_cover',
                width: "20%",
                render: (_: any, { book_cover }: any) => (
                    <>
                        <Image src={book_cover} alt={'cover'} />
                    </>
                ),
            },
            {
                title: 'Name',
                dataIndex: 'book_name',
                key: 'book_name',
                width: "20%"
            },
            {
                title: 'Authors',
                dataIndex: 'book_author',
                key: 'book_author',
                width: '24%',
            },
            {
                title: '',
                key: 'action',
                render: (_: any, record: SubDataType) => (
                    <Space size="middle" direction={"vertical"} style={{ alignItems: "center" }}>
                        <Button onClick={() => handleBookRemove(record)}>Remove</Button>
                    </Space>
                ),
            }
        ];
        const data: SubDataType[] = [];
        for (let i = 0; i < subtable.subtable.subtable.book_name.length; ++i) {
            data.push({
                book_author: subtable.subtable.subtable.book_author[i],
                book_cover: subtable.subtable.subtable.book_cover[i],
                book_name: subtable.subtable.subtable.book_name[i],
                book_id: subtable.subtable.subtable.book_id[i],
            });
        }
        return <Table columns={columns} dataSource={data} />;
    };

    const expandedRowRender = (record: any) => {
        return <ExpandedTable key={record.list_name} subtable={record} />;
    };

    const handleRemove = async (record: BookListDataType) => {
        console.log(record.list_name)
        try {
            const response = await fetch(serverUrl + `/booklists/delete/${record.list_name}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                router.reload();
            } else {
                console.error('Failed to delete booklist:', response.status);
            }
        } catch (error) {
            console.error('Error deleting booklist:', error);
        }
    }

    const columns = [...COLUMNS,
        {
            title: '',
            key: 'action',
            render: (_: any, record: BookListDataType) => (
                <Space size="middle" direction={"vertical"} style={{ alignItems: "center" }}>
                    <Button onClick={() => handleRemove(record)}>Remove</Button>
                </Space>
            ),
        }]

    return (
        <>
            <Head>
                <title>Book Store - User File</title>
                <meta name="description" content="Book store" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
                <Layout className={layoutstyles.layout1}>
                    <UserSiderbar />
                    <Layout className={layoutstyles.layout2}>
                        <div className={styles.tableDiv}>
                            <div className={styles.userBooklist}>
                                <div className={styles.title}>
                                    <h2 className={styles.myBooklist}>My Booklists</h2>
                                </div>
                                <Table columns={columns} expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }} dataSource={booklists} scroll={{ y: 420 }} />
                            </div>
                        </div>
                    </Layout>
                </Layout>
        </>
    )
}