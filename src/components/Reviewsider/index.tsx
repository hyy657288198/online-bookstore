'use client';

import {Avatar, Card, Layout, Switch} from 'antd';
import React, {useEffect, useState} from 'react';
import styles from "@/styles/review.module.css";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import Cookies from "js-cookie";
import {serverUrl} from "@/util/serverUrl";

const { Sider } = Layout;
const { Meta } = Card;

const url = "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1";

interface commentType {
    comment_id: number;
    is_hidden:boolean;
    user_email: string;
    content: string;
}

const ReviewCard = (props: any) => {
    return <Card className={styles.reviewcard}>
        <Meta
            avatar={
                <Avatar src={url} />
            }
            title={<span>{props.title}</span>}
            description={<span>{props.description}</span>}
        />
    </Card>
}

const ManagerReviewCard = (props: any) => {
    const [isChecked, setIsChecked] = useState(!props.review_status);
    const toggleCommentVisibility = async () => {
        const userCookie = Cookies.get('user');
        if (userCookie && userCookie.length > 2 && userCookie.length !== 0) {
            const userData = JSON.parse(userCookie);
            try {
                const response = await fetch(serverUrl + `/admin/comment/${props.comment_id}/hide`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`,
                    },
                });

                if (response.ok) {
                    setIsChecked(!isChecked);
                    console.log('Comment visibility toggled successfully');
                } else {
                    console.error('Failed to toggle comment visibility:', response.status);
                }
            } catch (error) {
                console.error('Error toggling comment visibility:', error);
            }
        }
    };

    return <Card className={styles.reviewcard} actions={
        [<Switch
            key="showOrHidden"
            checkedChildren={<div><EyeOutlined /> hide this review</div>}
            unCheckedChildren={<div><EyeInvisibleOutlined /> show this review</div>}
            onChange={toggleCommentVisibility}
            checked={isChecked}
        />]
    }>
        <Meta
            avatar={
                <Avatar src={url} />
            }
            title={<span>{props.title}</span>}
            description={<span>{props.description}</span>}
        />
    </Card>
}

export default function ReviewSiderbar() {

    const [unhiddenComments, setUnhiddenComments] = useState<commentType[]>([]);

    useEffect(() => {
        const fetchComments = async () => {
            const listCookie = Cookies.get('list');
            if (listCookie) {
                const listData = JSON.parse(listCookie);
                try {
                    const response = await fetch(serverUrl + `/booklists/unhiddenComments/${listData.list_name}`);
                    if (response.ok) {
                        const data = await response.json();
                        setUnhiddenComments(data.comments);
                    } else {
                        console.error('Failed to fetch comments');
                    }
                } catch (error) {
                    console.error('Error fetching comments:', error);
                }
            }
        };

        fetchComments();
    }, []);

    const generateReviewCards = () => {
        const reviewCards = [];

        for (let i = 0; i < unhiddenComments.length; i++) {
            const reviewData = unhiddenComments[i];
            reviewCards.push(
                <ReviewCard
                    key={"unhidden" + i}
                    title={reviewData.user_email}
                    description={reviewData.content}
                />
            );
        }

        return reviewCards;
    };

    const [comments, setComments] = useState<commentType[]>([]);

    useEffect(() => {
        const fetchComments = async () => {
            const listCookie = Cookies.get('list');
            if (listCookie) {
                const listData = JSON.parse(listCookie);
                try {
                    const response = await fetch(serverUrl + `/booklists/allComments/${listData.list_name}`);
                    if (response.ok) {
                        const data = await response.json();
                        setComments(data.comments);
                    } else {
                        console.error('Failed to fetch comments:', response.status);
                    }
                } catch (error) {
                    console.error('Error fetching comments:', error);
                }
            }
        };

        fetchComments();
    }, []);

    const generateAdminReviewCards = () => {
        const reviewCards = [];

        for (let i = 0; i < comments.length; i++) {
            const reviewData = comments[i];
            reviewCards.push(
                <ManagerReviewCard
                    key={reviewData.comment_id}
                    comment_id={reviewData.comment_id}
                    review_status={reviewData.is_hidden}
                    title={reviewData.user_email}
                    description={reviewData.content}
                />
            );
        }

        return reviewCards;
    };

    const Display = () => {
        const userCookie = Cookies.get('user');
        let userData;
        if(userCookie){
            userData = JSON.parse(userCookie);
            if(userData.is_admin){
                return generateAdminReviewCards();
            } else {
                return generateReviewCards();
            }
        }
    };

      return (
          <Sider width={"250px"} className={styles.reviewSider}>
              <h3 className={styles.reviewTitle}>Reviews</h3>
              {Display()}
          </Sider>
      )
}
