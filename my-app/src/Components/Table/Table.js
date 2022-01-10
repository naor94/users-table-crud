import React, { useEffect, useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Button } from 'antd';
import 'antd/dist/antd.css';
import  UserStore  from "../../Store/userListStore";
import {toJS} from "mobx";
import { observer } from 'mobx-react';



const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable =  observer(({userStore}) => {
const users=userStore.users;
console.log(users);

  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [key, setKey]=useState(0);

  const isEditing = (record) => record.key === editingKey;

  useEffect(() => {
      userStore.getUsersFromApi();
      const naor=userStore.getUsers();
       setData(users);
      console.log(naor);

  },[data]);

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const deleteUser= (record)=>{

    const dataSource = [...data];
    const filteredData= dataSource.filter((item) => item.key !== record.key);
    setData(filteredData);
      
  

  }

  const cancel = () => {
    setEditingKey('');
  };

  const handleAdd= ()=>{
    const newUser = {
      key: key.toString(),
      gender:"",
      email:"",
      name: "",
      age: 0,
      country: " ",
    };
    setKey(key+1);
    UserStore.users = [...UserStore.users, newUser];

    
    //setData(toJS(UserStore.users));

   // UserStore.addUser();

     }

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '20%',
      editable: true,
    },
    {
      title: 'gender',
      dataIndex: 'gender',
      width: '20%',
      editable: true,
    },
    {
      title: 'age',
      dataIndex: 'age',
      width: '20%',
      editable: true,
    },
    {
      title: 'email',
      dataIndex: 'email',
      width: '20%',
      editable: true,
    },

    {
      title: 'country',
      dataIndex: 'country',
      width: '20%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (<div>
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit 
          </Typography.Link>
          <Typography.Link disabled={editingKey !== ''} onClick={() => deleteUser(record)}>
          Delete
        </Typography.Link>
          </div>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
});

export default EditableTable;