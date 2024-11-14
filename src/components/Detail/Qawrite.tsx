import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

function Qawrite() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const onFinish = async (values: { title: string; content: string }) => {
      setLoading(true);
      try {
          const token = localStorage.getItem('token');
          if (!token) {
              message.error('로그인이 필요합니다.');
              router.push('/mall/login');
              return;
          }

          const decoded: any = jwtDecode(token);
          const userId = decoded.UserID;

          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/qas`, {
              userId,
              productId: id,
              title: values.title,    // 제목 추가
              question: values.content,
          }, { 
              headers: { 
                  authorization: `Bearer ${token}` 
              } 
          });
          
          message.success('문의가 성공적으로 등록되었습니다.');
          router.push(`/mall/product/${id}`);
      } catch (error) {
          console.error('문의 등록 에러:', error);
          message.error('문의 등록에 실패했습니다. 다시 시도해 주세요.');
      } finally {
          setLoading(false);
      }
  };

  return (
      <div style={styles.container}>
          <h1 style={styles.title}>상품 문의하기</h1>
          <Form layout="vertical" onFinish={onFinish} style={styles.form}>
              <Form.Item 
                  label="제목" 
                  name="title" 
                  rules={[{ required: true, message: '제목을 입력해주세요.' }]}
              >
                  <Input 
                      placeholder="문의 제목을 입력해주세요." 
                  />
              </Form.Item>
              <Form.Item 
                  label="문의 내용" 
                  name="content" 
                  rules={[{ required: true, message: '문의 내용을 입력해주세요.' }]}
              >
                  <Input.TextArea 
                      rows={6} 
                      placeholder="문의하실 내용을 자세히 입력해주세요." 
                  />
              </Form.Item>
              <Form.Item>
                  <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading} 
                      style={styles.submitButton}
                  >
                      문의하기
                  </Button>
              </Form.Item>
          </Form>
      </div>
  );
}

export default Qawrite;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif',
  },
  title: {
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center' as 'center',
      marginBottom: '20px',
  },
  form: {
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      border: '1px solid #ddd',
  },
  submitButton: {
      width: '100%',
  },
};