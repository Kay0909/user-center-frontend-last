import React, { useRef } from 'react';
import { ProTable, ActionType } from '@ant-design/pro-components';
import { Input, Button, message, Modal, Form, Select } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { request, useModel } from 'umi';

const { Option } = Select;

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const userRole = initialState?.currentUser?.userRole ?? 0;

  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any>({});
  const [form] = Form.useForm();

  const handleEdit = (record: any) => {
    setCurrentUser(record);
    setEditModalVisible(true);
    setTimeout(() => {
      form.setFieldsValue({
        userAccount: record.userAccount || '',
        username: record.username || '',
        email: record.email || '',
        phone: record.phone || '',
        gender: record.gender,
        userStatus: record.userStatus,
        userRole: record.userRole,
      });
    }, 0);
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
  };

  const handleEditSave = async () => {
    try {
      const values = await form.validateFields();
      // 补充 id 字段
      const updateData = { ...values, id: currentUser.id };
      const res = await request('/api/user/update', {
        method: 'POST',
        data: updateData,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.code === 0 && res.data) {
        message.success('保存成功');
        setEditModalVisible(false);
        actionRef.current?.reload();
      } else {
        message.error(res.description || '保存失败');
      }
    } catch (e) {
      message.error('保存失败，请重试');
    }
  };

  const columns: ProColumns<API.CurrentUser>[] = [
    { title: 'ID', dataIndex: 'id', hideInSearch: true },
    { title: '用户账号', dataIndex: 'userAccount' },
    { title: '用户名', dataIndex: 'username', hideInSearch: true },
    { title: '用户头像', dataIndex: 'avatarUrl', hideInSearch: true, render: (_, record) => {
      const url = record.avatarUrl || '/icons/user-center.png';
      return <img src={url} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />;
    } },
    { title: '手机号', dataIndex: 'phone', hideInSearch: true },
    { title: '邮箱', dataIndex: 'email', hideInSearch: true },
    { title: '性别', dataIndex: 'gender', hideInSearch: true, render: (_, record) => record.gender === 1 ? '男' : record.gender === 0 ? '女' : '' },
    { title: '用户状态', dataIndex: 'userStatus', hideInSearch: true, render: (_, record) => (record.userStatus === 0 ? '正常' : record.userStatus) },
    { title: '创建时间', dataIndex: 'createTime', valueType: 'dateTime', hideInSearch: true },
    { title: '角色', dataIndex: 'userRole', hideInSearch: true, render: (_, record) => (record.userRole === 1 ? '管理员' : '普通用户') },
    {
      title: '操作',
      valueType: 'option',
      hideInTable: false,
      render: (_, record) => {
        if (userRole !== 1) return null;
        return [
          <a key="edit" onClick={() => handleEdit(record)}>编辑</a>,
          <a key="delete" style={{ color: 'red', marginLeft: 8 }} onClick={async () => {
            Modal.confirm({
              title: '确认删除该用户吗？',
              onOk: async () => {
                try {
                  const res = await request('/api/user/delete', {
                    method: 'POST',
                    data: record.id,
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                  if (res.code === 0 && res.data) {
                    message.success('删除成功');
                    actionRef.current?.reload();
                  } else {
                    message.error(res.description || '删除失败');
                  }
                } catch (e) {
                  message.error('删除失败，请重试');
                }
              },
            });
          }}>删除</a>,
        ];
      },
    },
  ];

  return (
    <>
      <ProTable<API.CurrentUser>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        request={async (params) => {
          // 只传递用户账号作为查询参数
          const { userAccount, current, pageSize } = params;
          const res = await request<{
            data: API.CurrentUser[];
            total: number;
            success: boolean;
          }>('/api/user/search', {
            method: 'GET',
            params: {
              userAccount,
              current,
              pageSize,
            },
          });
          return {
            data: res.data || [],
            total: res.total || 0,
            success: res.success,
          };
        }}
        columns={columns}
        pagination={{ showQuickJumper: true }}
      />
      <Modal
        title="编辑用户信息"
        open={editModalVisible}
        onCancel={handleEditCancel}
        onOk={handleEditSave}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          {/* 移除ID输入框 */}
          <Form.Item label="用户账号" name="userAccount">
            <Input disabled />
          </Form.Item>
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
          <Form.Item label="用户状态" name="userStatus">
            <Select allowClear placeholder="请选择用户状态">
              <Option value={0}>正常</Option>
              <Option value={1}>禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item label="角色" name="userRole">
            <Select allowClear placeholder="请选择角色">
              <Option value={1}>管理员</Option>
              <Option value={0}>普通用户</Option>
            </Select>
          </Form.Item>
          {/* 移除创建时间输入框 */}
        </Form>
      </Modal>
    </>
  );
};

export default UserList; 