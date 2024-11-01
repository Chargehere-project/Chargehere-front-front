import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
const FindPw = () => {
    const [id, setId] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const handleResetPassword = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/findpw', { id, name, phone });
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
        <Form onSubmitCapture={handleResetPassword} style={{ maxWidth: 400 }}>
            <Form.Item label="아이디" required>
                <Input value={id} onChange={(e) => setId(e.target.value)} />
            </Form.Item>
            <Form.Item label="이름" required>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Item>
            <Form.Item label="핸드폰 번호" required>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">비밀번호 찾기</Button>
            </Form.Item>
            {message && <div style={{ color: 'green' }}>{message}</div>}
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </Form>
    );
};
export default FindPw;