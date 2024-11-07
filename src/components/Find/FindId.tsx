import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

const FindId = () => {
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleFindId = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/findid', { name, phone });
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
        <div style={styles.container}>
            <Form onSubmitCapture={handleFindId} style={styles.form}>
                <Title level={2} style={styles.title}>아이디 찾기</Title>
                <Form.Item label="이름" required style={styles.formItem}>
                    <Input
                        placeholder="이름을 입력하세요"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                    />
                </Form.Item>
                <Form.Item label="핸드폰 번호" required style={styles.formItem}>
                    <Input
                        placeholder="핸드폰 번호를 입력하세요"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={styles.input}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block style={styles.button}>
                        아이디 찾기
                    </Button>
                </Form.Item>
                {result && <Text type="success" style={styles.successText}>{result}</Text>}
                {errorMessage && <Text type="danger" style={styles.errorText}>{errorMessage}</Text>}
                <Text style={styles.footerText}>
                    비밀번호를 잊으셨나요? <a href="../../mall/findpw" style={styles.link}>비밀번호 찾기</a>
                </Text>
            </Form>
        </div>
    );
};

export default FindId;

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '75vh',
        padding: '20px',
    },
    form: {
        maxWidth: '500px',
        width: '100%',
        padding: '30px',
        borderRadius: '10px',
        border: '1px solid #E5E5E5',
        backgroundColor: '#ffffff',
    },
    title: {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333',
    },
    formItem: {
        marginBottom: '20px',
    },
    input: {
        borderRadius: '4px',
        padding: '10px',
    },
    button: {
        fontWeight: 'bold',
        borderRadius: '4px',
        height: '45px',
        background: '#0597F2'
    },
    successText: {
        display: 'block',
        color: 'green',
        textAlign: 'center',
        marginTop: '10px',
    },
    errorText: {
        display: 'block',
        color: 'red',
        textAlign: 'center',
        marginTop: '10px',
    },
    footerText: {
        textAlign: 'center',
        marginTop: '20px',
        color: '#666',
    },
    link: {
        color: '#1890ff',
    },
};