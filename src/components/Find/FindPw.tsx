import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import axios from 'axios';
import styles from './Find.module.css';

const { Title, Text } = Typography;

const FindPw = () => {
    const [id, setId] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const handleResetPassword = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/findpw`, { id, name, phone });
            if (response.data.data) {
                setMessage(`비밀번호: ${response.data.data.Password}`);
                setErrorMessage('');
            } else {
                setMessage('');
                setErrorMessage('일치하는 정보가 없습니다.');
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('에러가 발생했습니다.');
        }
    };
    return (
        <div className={styles.container}>
            <Form onSubmitCapture={handleResetPassword} className={styles.form}>
            <Title level={2} className={styles.title}>비밀번호 찾기</Title>


            <Form.Item label="아이디" required className={styles.formItem}>
                <Input 
                    placeholder="아이디를 입력하세요"
                    value={id} 
                    onChange={(e) => setId(e.target.value)}
                    className={styles.input}
                     />
            </Form.Item>


            <Form.Item label="이름" required className={styles.formItem}>
                    <Input
                        placeholder="이름을 입력하세요"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input}
                    />
                </Form.Item>


                <Form.Item label="핸드폰 번호" required className={styles.formItem}>
                    <Input
                        placeholder="핸드폰 번호를 입력하세요"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={styles.input}
                    />
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit" block className={styles.button}>
                        비밀번호 찾기
                    </Button>
                </Form.Item>

                {message && <Text type="success" className={styles.successText}>{message}</Text>}
                {errorMessage && <Text type="danger" className={styles.errorText}>{errorMessage}</Text>}

                <Text className={styles.footerText}>
                    아이디를 잊으셨나요? <a href="../../mall/findid" className={styles.link}>아이디 찾기</a>
                </Text>
        </Form>


        </div>


        
    );
};
export default FindPw;