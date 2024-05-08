'use client';

import styles from '@/styles/searchstyle.module.css';
import {Layout, Space, Radio, Divider, Checkbox} from 'antd';
import React, {useState} from 'react';
import type { RadioChangeEvent } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

const { Sider } = Layout;

interface SidebarProps {
    onRadioChange: (newValue: string) => void;
    onCheckboxChange: (checkedValues: CheckboxValueType[]) => void;

}

export default function Siderbar({ onRadioChange, onCheckboxChange }: SidebarProps) {
    const [value, setValue] = useState("book");
      const onChange = (e: RadioChangeEvent) => {
          setValue(e.target.value);
          onRadioChange(e.target.value);
      };

    const onCheckBoxChange = (checkedValues: CheckboxValueType[]) => {
        onCheckboxChange(checkedValues);
    };

      return (
          <Sider theme={"dark"}>
              <div>

                  <Divider style={{color:"white", borderColor: "white", marginBottom: "5px", fontSize: "18px"}}>
                      Type
                  </Divider>
                  <Radio.Group className={styles.filterItem} onChange={onChange} defaultValue="book" buttonStyle="solid">
                      <Space direction="vertical">
                          <Radio value="book" className={styles.ratio}>Book</Radio>
                          <Radio value="booklist" className={styles.ratio}>Book List</Radio>
                      </Space>
                  </Radio.Group>

                  {value === "book" && (
                      <div>
                          <Divider style={{ color: "white", borderColor: "white", marginBottom: "5px", fontSize: "18px" }}>
                              Search in
                          </Divider>
                          <Checkbox.Group className={styles.filterItem} onChange={onCheckBoxChange}>
                              <Space direction="vertical">
                                  <Checkbox value="title" className={styles.ratio}>Title</Checkbox>
                                  <Checkbox value="author" className={styles.ratio}>Author</Checkbox>
                                  <Checkbox value="field" className={styles.ratio}>Field</Checkbox>
                              </Space>
                          </Checkbox.Group>
                      </div>
                  )}
              </div>
          </Sider>
      )
}
