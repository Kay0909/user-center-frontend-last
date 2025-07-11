import React, { useState, useEffect } from 'react';
import { Card, Avatar, Descriptions, Button, Form, Input, Select, message, Modal } from 'antd';
import { useModel } from 'umi';

const { Option } = Select;

const MyProfile: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const user = initialState?.currentUser || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    setModalVisible(true);
    // 不再需要 setFieldsValue
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setInitialState({
        ...initialState,
        currentUser: {
          ...user,
          ...values,
        },
      });
      message.success('保存成功');
      setModalVisible(false);
    } catch (e) {}
  };

  return (
    <Card title="我的信息" style={{ maxWidth: 600, margin: '40px auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Avatar size={80} src={user.avatarUrl || '/icons/user-center.png'} />
        <div style={{ marginLeft: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 500 }}>{user.username || user.userAccount || '未设置用户名'}</div>
          <div style={{ color: '#888' }}>{user.email || '未设置邮箱'}</div>
        </div>
      </div>
      <Descriptions column={1} bordered size="middle">
        <Descriptions.Item label="用户账号">{user.userAccount || '-'}</Descriptions.Item>
        <Descriptions.Item label="用户名">{user.username || '-'}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{user.email || '-'}</Descriptions.Item>
        <Descriptions.Item label="手机号">{user.phone || '-'}</Descriptions.Item>
        <Descriptions.Item label="性别">{user.gender === 1 ? '男' : user.gender === 0 ? '女' : ''}</Descriptions.Item>
        <Descriptions.Item label="用户状态">{user.userStatus === 0 ? '正常' : user.userStatus}</Descriptions.Item>
        <Descriptions.Item label="用户角色">{user.userRole === 1 ? '管理员' : '普通用户'}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{user.createTime ? new Date(user.createTime).toLocaleString() : '-'}</Descriptions.Item>
      </Descriptions>
      <Button type="primary" style={{ marginTop: 24 }} onClick={handleEdit} disabled={!user.userAccount && !user.username}>编辑</Button>
      <Modal
        title="编辑我的信息"
        open={modalVisible}
        onCancel={handleCancel}
        onOk={handleSave}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            username: user.username || '',
            email: user.email || '',
            phone: user.phone || '',
            gender: user.gender,
          }}
          key={modalVisible ? (user.id || user.userAccount || 'edit') : 'closed'}
        >
          <Form.Item label="用户名" name="username">
            <Input />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ type: 'email', message: '请输入有效邮箱' }]}> 
            <Input />
          </Form.Item>
          <Form.Item label="手机号" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="性别" name="gender">
            <Select allowClear placeholder="请选择性别">
              <Option value={1}>男</Option>
              <Option value={0}>女</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default MyProfile; 