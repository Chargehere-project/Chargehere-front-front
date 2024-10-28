import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
const FindId= () => {
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const handleFindId = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5005/api/find-id', { name, phone });
            if (response.data.success) {
                setResult(`아이디: ${response.data.id}`);
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
        <Form onSubmitCapture={handleFindId} style={{ maxWidth: 400 }}>
            <Form.Item label="이름" required>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Item>
            <Form.Item label="핸드폰 번호" required>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">아이디 찾기</Button>
            </Form.Item>
            {result && <div style={{ color: 'green' }}>{result}</div>}
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </Form>
    );
};
export default FindId;