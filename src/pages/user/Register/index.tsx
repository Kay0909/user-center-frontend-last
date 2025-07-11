import Footer from '@/components/Footer';
import { register } from '@/services/ant-design-pro/api';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { history } from 'umi';
import styles from './index.less';

const RegisterMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Register: React.FC = () => {
  const [registerState, setRegisterState] = useState<any>({});

  const handleSubmit = async (values: any) => {
    if (values.userPassword !== values.checkPassword) {
      message.error('两次输入的密码不一致！');
      return;
    }
    try {
      const res = await register({
        userAccount: values.userAccount,
        userPassword: values.userPassword,
        checkPassword: values.checkPassword,
      });
      if (res && res.code === 0) {
        message.success('注册成功！');
        setTimeout(() => {
          history.push('/user/login');
        }, 1000);
      } else {
        message.error(res?.description || '注册失败');
      }
    } catch (e) {
      message.error('注册失败，请重试！');
    }
  };

  const { status, type: registerType } = registerState;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/icons/user-center.png" />}
          title="用户注册"
          subTitle={'欢迎加入用户管理中心'}
          initialValues={{}}
          actions={[]}
          onFinish={handleSubmit}
          submitter={{
            searchConfig: {
              submitText: '注册',
            },
          }}
        >
          {status === 'error' && registerType === 'account' && (
            <RegisterMessage content={'注册失败，请检查输入信息'} />
          )}
          
          <ProFormText
            name="userAccount"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.icon} />,
            }}
            placeholder={'请输入用户账号'}
            rules={[
              {
                required: true,
                message: '用户账号是必填项！',
              },
              {
                min: 3,
                message: '用户账号至少3个字符！',
              },
            ]}
          />
          
          <ProFormText.Password
            name="userPassword"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.icon} />,
            }}
            placeholder={'请输入密码'}
            rules={[
              {
                required: true,
                message: '密码是必填项！',
              },
              {
                min: 6,
                message: '密码至少6个字符！',
              },
            ]}
          />
          
          <ProFormText.Password
            name="checkPassword"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.icon} />,
            }}
            placeholder={'请确认密码'}
            rules={[
              { required: true, message: '确认密码是必填项！' },
            ]}
          />

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <a
              style={{
                float: 'right',
              }}
              onClick={() => {
                history.push('/user/login');
              }}
            >
              已有账号？去登录
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Register; 