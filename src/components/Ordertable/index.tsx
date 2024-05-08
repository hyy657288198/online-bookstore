import {Image, Table} from "antd";
import React, {useState} from "react";
import {ColumnsType} from "antd/es/table";
import Cookies from "js-cookie";
import {serverUrl} from "@/util/serverUrl";

interface DataType {
    order_id: number;
    username: string;
    user_email: string
    book_cover: string;
    book_name: string;
    book_price: string;
    quantity: number;
    total_price: string;
    created_at: string;
    book_id: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: 'Order ID',
        dataIndex: 'order_id',
        key: 'order_id',
    },
    {
        title: 'Order Time',
        dataIndex: 'created_at',
        key: 'created_at',
    },
    {
        title: 'Item',
        dataIndex: 'book_cover',
        key: 'book_cover',
        width:"20%",
        render: (_, { book_cover }) => (
            <>
                <Image src={book_cover} alt={'cover'}/>
            </>
        ),
    },
    {
        title: 'Book Price',
        dataIndex: 'book_price',
        key: 'book_price',
        render:(price) => {
            return <p>{price} CAD</p>
        }
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        width:"10%"
    },
    {
        title: 'Total',
        dataIndex: 'total_price',
        key: 'total_price',
        width:"10%",
        render: (total_price) => {
            return <p>{total_price} CAD</p>;
        },
    }
];


export default function OrderTable() {
    const [orderData, setOrderData] = useState<DataType[]>([]);
    const fetchData = async () => {
        try {
            const userCookie = Cookies.get('user');
            if (userCookie && userCookie.length > 2 && userCookie.length !== 0) {
                const userData = JSON.parse(userCookie);

                const response = await fetch(serverUrl + `/orders/get-user-orders`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`,
                    },
                });

                const data = await response.json();
                if (JSON.stringify(orderData) !== JSON.stringify(data.userOrders)) {
                    setOrderData(data.userOrders);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    fetchData();
  return (
      <Table columns={columns} dataSource={orderData} scroll={{y:450}} />
    )
}
