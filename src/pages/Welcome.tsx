import { PageContainer } from '@ant-design/pro-components';
import { Alert, Card, Typography } from 'antd';
import React from 'react';
import styles from './Welcome.less';
const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);
const Welcome: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Typography.Title level={2} style={{ textAlign: 'center' }}>
          欢迎使用用户管理中心
        </Typography.Title>
        <Typography.Paragraph style={{ fontSize: 16, marginTop: 24 }}>
          用户管理中心是企业统一的用户账号与权限管理平台，致力于为企业提供：
          <ul>
            <li>统一管理企业用户账号、权限与信息</li>
            <li>多角色分级管理，权限灵活配置</li>
            <li>安全的登录与认证机制</li>
            <li>用户数据的查询、导入、导出</li>
            <li>操作日志全程可追溯</li>
          </ul>
          <br />
          如需帮助，请联系管理员。
        </Typography.Paragraph>
      </Card>
    </PageContainer>
  );
};
export default Welcome;
