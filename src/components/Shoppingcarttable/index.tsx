import {Button, Space, Table, Image} from "antd";
import React, {useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {ShoppingCartOutlined} from "@ant-design/icons";
import Cookies from "js-cookie";
import {serverUrl} from "@/util/serverUrl";


interface DataType {
    book_id: string;
    book_cover:string;//book cover - items:volumeInfo:imageLinks
    book_name: string;//book name - items:volumeInfo:title
    book_price: number;//price - items:saleInfo:listPrice:amount
    quantity: number;
    book_author: string;
    user_email: string;

}

type Props = {
    haveButton?:boolean;
    onTotalChange?: (total: number) => void;
}
export default function ShoppingCartTable(orderOrShopping:Props) {

    const columns: ColumnsType<DataType> = [
        {
            title: 'Item',
            dataIndex: 'book_cover',
            key: 'book_cover',
            width:"10%",
            render: (_, { book_cover }) => (
                <>
                    <Image src={book_cover} alt={''}/>
                </>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'book_name',
            key: 'book_name',
            width:"10%"
        },
        {
            title: 'Price',
            dataIndex: 'book_price',
            key: 'book_price',
            width:"10%",
            render:(book_price:number) => {
                return <p>{book_price} CAD</p>
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
            dataIndex: 'total',
            key: 'total',
            width:"10%",
            render: (_, record) => {
                const total = record.quantity * record.book_price;
                return <p>{total.toFixed(2)} CAD</p>;
            },
        }
    ];

    if(orderOrShopping.haveButton){
        columns.push({
            title: '',
            key: 'remove',
            width:"12%",
            render: (_: any, record: DataType ) => (
                <Space size="middle">
                    <Button onClick={() => handleRemove(record)}>Remove <ShoppingCartOutlined /></Button>
                </Space>
            ),
        })
    }

    const handleRemove  = async (record: DataType) => {
        await removeFromCart(record.book_id);
        await fetchData();
    }

    const removeFromCart = async (bookId: any) => {
        try {
            const userCookie = Cookies.get('user');
            let userData;
            if(userCookie){
                userData = JSON.parse(userCookie);
                const response = await fetch(serverUrl + `/carts/remove-from-cart/${bookId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`,
                    },
                });

                if (response.status === 200) {
                    console.log('Book removed successfully');
                } else if (response.status === 404) {
                    console.log('Book not found in cart');
                } else {
                    console.error('Error removing book from cart:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Error removing book from cart');
        }
    };

    const [cartData, setCartData] = useState<DataType[]>([]);

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try {
            const userCookie = Cookies.get('user');
            if (userCookie && userCookie.length > 2 && userCookie.length !== 0) {
                const userData = JSON.parse(userCookie);

                const response = await fetch(serverUrl + `/carts/get-cart-contents`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`,
                    },
                });

                const data = await response.json();

                if (JSON.stringify(cartData) !== JSON.stringify(data.cartContents)) {
                    setCartData(data.cartContents);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const totalSum = cartData.reduce((sum, item) => {
        return sum + item.quantity * item.book_price;
    }, 0);

    if (orderOrShopping.onTotalChange) {
        orderOrShopping.onTotalChange(totalSum);
    }

    return (
      <Table columns={columns} dataSource={cartData} scroll={{y:420}} pagination={{ position:["bottomCenter"] }} />
  )
}
