import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import axios from 'axios';
import styles from './Find.module.css';

const { Title, Text } = Typography;

const FindId = () => {
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleFindId = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/findid`, { name, phone });
            console.log(response.data.data);
            if (response.data.data) {
                setResult(`아이디: ${response.data.data.LoginID}`);
                setErrorMessage('');
            } else {
                setResult('');
                setErrorMessage('일치하는 정보가 없습니다.');
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('에러가 발생했습니다.');
        }
    };

    return (
        <div className={styles.container}>
            <Form onSubmitCapture={handleFindId} className={styles.form}>
                <Title level={2} className={styles.title}>아이디 찾기</Title>
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
                        아이디 찾기
                    </Button>
                </Form.Item>
                {result && <Text type="success" className={styles.successText}>{result}</Text>}
                {errorMessage && <Text type="danger" className={styles.errorText}>{errorMessage}</Text>}
                <Text className={styles.footerText}>
                    비밀번호를 잊으셨나요? <a href="../../mall/findpw" className={styles.link}>비밀번호 찾기</a>
                </Text>
            </Form>
        </div>
    );
};

export default FindId;
