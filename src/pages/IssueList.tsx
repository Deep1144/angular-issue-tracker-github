import { Spin, Table } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { IIssues } from '../models/Issues';
import { IssuesTableColumns } from '../constants/tableConfigs/IssuesTableConfig';

export interface IIssueList {
    repoUrl: string;
}

interface IGetIssueList { page: number, sortField: string, sortOrder: 'ascend' | 'descend', state: string }

const IssueList = ({ repoUrl }: IIssueList) => {
    const [repoInfo, setRepoInfo] = useState<any>();
    const [issueList, setIssueList] = useState<IIssues[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loader, setLoader] = useState(false);
    const [paginationLoader, setPaginationLoader] = useState(false);

    const [apiParams, setApiParams] = useState<IGetIssueList>({
        page: 1,
        sortField: 'comments',
        sortOrder: 'descend',
        state: ''
    })

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
            // await getIssueList();
            setLoader(false);
        } catch (error: any) {
            setLoader(false);
            toast.error(error.message);
        }
    }


    useEffect(() => {
        getIssueList(apiParams);
    }, [apiParams])


    const getIssueList = async (params: IGetIssueList = {
        page: 1,
        sortField: 'comments',
        sortOrder: 'descend',
        state: ''
    }) => {
        try {
            const { page, sortField, sortOrder, state } = params;
            const order = sortOrder === 'descend' ? 'desc' : 'asc';
            setPaginationLoader(true);

            let apiUrl = 'https://api.github.com/search/issues?q=repo:' + repoUrl + '+type:issue';
            if (state) {
                apiUrl = apiUrl + '+state:' + state;
            }
            const response = await axios.get(apiUrl, {
                params: {
                    page,
                    sort: sortField,
                    order
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


    const handleTableStateChange = (pagination: any, filters: any, sorter: any, extra: { action: string, currentDataSource: Array<IIssues> }) => {
        console.log({ sorter })
        let state = '';

        // If 1 item is selected in filter of state,  say open or closed then we include the filter
        // otherwise by default it will return all issues
        if (filters['state'] && filters['state'].length === 1) {
            state = filters['state'][0];
        }

        const params = {
            state,
            sortOrder: sorter?.order,
            sortField: sorter.columnKey,
            page: extra.action === "sort" ? 1 : pagination.current // reset page on sorting
        }
        setApiParams(params);
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
                        <Table dataSource={issueList} columns={IssuesTableColumns} loading={paginationLoader}
                            onChange={handleTableStateChange}
                            pagination={{
                                total: totalCount,
                                pageSize: 30,
                                current: apiParams.page,
                                pageSizeOptions: [],
                            }} />
                    </div>
                </div>
            }
        </div>
    )
}

export default IssueList