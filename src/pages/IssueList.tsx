import { Spin, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { IIssues } from '../models/Issues';

const columns: ColumnsType<IIssues> = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => <a href={record.html_url} target={'_blank'}>{text}</a>,
    },
    {
        title: 'Comment Count',
        dataIndex: 'comments',
        key: 'comments',
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
        }
    },
    {
        title: 'Date',
        dataIndex: 'date',
        width: '15%',
        render: (text, record) => {
            console.log("text", text)
            let data = record.state === 'closed' ? 'Closed at: ' + new Date(record.closed_at).toDateString() : 'Created at: ' + new Date(record.created_at).toDateString();
            return data;
        }
    }
];


export interface IIssueList {
    repoUrl: string;
}

const IssueList = ({ repoUrl }: IIssueList) => {

    const [repoInfo, setRepoInfo] = useState<any>();
    const [issueList, setIssueList] = useState<IIssues[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);

    const [loader, setLoader] = useState(false);

    const [paginationLoader, setPaginationLoader] = useState(false);

    useEffect(() => {
        if (repoUrl && !loader && !repoInfo) {
            getRepoInfo()
        }
    }, [repoUrl])


    const getRepoInfo = async () => {
        try {
            setLoader(true);
            const response = await axios.get('https://api.github.com/repos/' + repoUrl);
            setRepoInfo(response.data);
            await getIssueList();
            setLoader(false);
            console.log({ response })
        } catch (error: any) {
            setLoader(false);
            toast.error(error.message);
        }

    }


    const getIssueList = async (page = 1, pageSize = 30) => {
        try {
            //' + '+type:issue'
            setPaginationLoader(true);
            const response = await axios.get('https://api.github.com/search/issues?q=repo:' + repoUrl + '+type:issue', {
                params: {
                    per_page: pageSize,
                    page
                }
            });
            setTotalCount(response.data.total_count)
            setIssueList(response.data.items);
            setPaginationLoader(false);
        } catch (error: any) {
            setLoader(false);
            setPaginationLoader(false);
            toast.error(error.message);
        }
    }

    const onPageChange = async (page: number, pageSize: number) => {
        console.log({ page, pageSize });
        await getIssueList(page, pageSize);
    }

    return (
        <div className='h-full'>
            {
                loader &&
                <div className='flex justify-center items-center h-screen'>
                    <Spin size="large" />
                </div>
            }


            {
                !loader && repoInfo &&
                <div className='justify-center flex container my-20 mx-auto flex-col items-center'>
                    <h2 className='text-3xl font-bold'>
                        Issue list from {repoInfo.name}
                    </h2>


                    <div className='mt-20'>
                        <Table dataSource={issueList} columns={columns} loading={paginationLoader} pagination={{
                            total: totalCount,
                            pageSize: 30,
                            pageSizeOptions: [],
                            onChange: onPageChange,
                        }} />
                    </div>
                </div>
            }
        </div>
    )
}

export default IssueList