import { useEffect, useState } from 'react'
import { Avatar, Card, Spin, Tag } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IIssueDetails } from '../models/IssueDetails';
import { IIssueList } from './IssueList'
import ReactMarkdown from 'react-markdown';
import CommentsTimeLine from '../components/CommentsTimeline';

function IssueDetails({ repoUrl }: IIssueList) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [issueDetails, setIssueDetails] = useState<IIssueDetails>();
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (repoUrl && !loader && !issueDetails) {
            getIssueDetails()
        }
    }, [repoUrl])


    const getIssueDetails = async () => {
        try {
            setLoader(true);
            const response = await axios.get(`https://api.github.com/repos/${repoUrl}/issues/${id}`);
            setIssueDetails(response.data);
            setLoader(false);
        } catch (error: any) {
            setLoader(false);
            toast.error(error.message);
            navigate('/');
        }
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
                !loader && issueDetails &&
                <div className='justify-center flex container my-20 mx-auto flex-col'>
                    <div className='flex flex-col'>
                        <h2 className='text-3xl font-bold'>
                            #{issueDetails.number} {issueDetails.title}
                        </h2>

                        <div className='flex items-center my-4'>
                            <Tag className='text-lg  w-fit' color={issueDetails.state === 'closed' ? 'green' : 'red'}>
                                {issueDetails.state.toUpperCase()}
                            </Tag>
                            <p className='mb-0'>
                                <a href={issueDetails.user.html_url} target={'_blank'}>
                                    <Avatar src={issueDetails.user.avatar_url} style={{
                                        margin: '0px 10px'
                                    }} />
                                    {issueDetails.user.login}
                                </a>
                                &nbsp; Opened this issue on {new Date(issueDetails.created_at).toDateString()}
                            </p>


                            <Tag color={'default'} style={{
                                marginLeft: '10px'
                            }}>
                                {issueDetails.comments} Comments
                            </Tag>
                        </div>
                    </div>

                    <Card
                        className='mt-10'
                        type="inner"
                        title={'Issue Description'}
                    >
                        <ReactMarkdown>
                            {
                                issueDetails.body
                            }
                        </ReactMarkdown>

                    </Card>

                    <CommentsTimeLine issueId={id!} repoUrl={repoUrl} totalCount={issueDetails.comments} />
                </div>
            }
        </div>
    )
}



export default IssueDetails