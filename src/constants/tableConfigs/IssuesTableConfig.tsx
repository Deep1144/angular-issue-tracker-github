import { ColumnsType } from "antd/lib/table"
import { IIssues } from "../../models/Issues"
import { Tag } from 'antd';
import { Link } from "react-router-dom";


export const IssuesTableColumns: ColumnsType<IIssues> = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => <Link to={`/issue/${record.number}`} >{text}</Link>,
    },
    {
        title: 'Comment Count',
        dataIndex: 'comments',
        key: 'comments',
        sortDirections: ['ascend', 'descend', 'ascend'],
        sorter: true,
        defaultSortOrder: 'descend'
    },
    {
        title: 'Issue Number',
        dataIndex: 'number',
        key: 'number',
        render: (text, record) => <a href={record.html_url} target={'_blank'}>#{text}</a>
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
        render: (text) => {
            let color = 'green'
            if (text === 'open') {
                color = 'red';
            }
            return (
                <Tag color={color} key={text}>
                    {text.toUpperCase()}
                </Tag>
            );
        },
        filters: [
            {
                text: <span>Closed</span>,
                value: 'closed',
            },
            {
                text: <span>Open</span>,
                value: 'open',
            },
        ],
        filterSearch: true,
    },
    {
        title: 'Date',
        dataIndex: 'date',
        width: '15%',
        render: (text, record) => {
            let data = record.state === 'closed' ? 'Closed at: ' + new Date(record.closed_at).toDateString() : 'Created at: ' + new Date(record.created_at).toDateString();
            return data;
        }
    }
];
