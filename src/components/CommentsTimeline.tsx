import { useEffect, useState } from 'react'
import { Button, Timeline } from 'antd';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IComments } from '../models/comment';
import CommentCard from '../components/CommentCard';

// https://api.github.com/repos/OWNER/REPO/issues/ISSUE_NUMBER/comments
const CommentsTimeLine = ({ issueId, repoUrl, totalCount }: { issueId: string, repoUrl: string, totalCount: number }) => {

    const [page, setPage] = useState(1);
    const [comments, setComments] = useState<IComments[]>([]);
    const [loading, setLoading] = useState(false);

    const getComments = async (perPage = 10) => {
        const url = `https://api.github.com/repos/${repoUrl}/issues/${issueId}/comments`;
        setLoading(true);

        try {
            const data = await axios.get(url, {
                params: {
                    page,
                    per_page: perPage
                }
            })
            setLoading(false);
            setComments([...comments, ...data.data]);
        } catch (error: any) {
            toast.error(error.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        getComments()
    }, [page]);

    const handleLoadMore = () => {
        setPage(page + 1);
    }

    return (
        <div className='mt-10'>
            <h2 className='text-3xl'>Comments: </h2>

            <div>
                <Timeline>
                    {
                        comments.map((e) => {
                            return (
                                <Timeline.Item>
                                    <CommentCard comment={e} />
                                </Timeline.Item>
                            )
                        })
                    }
                </Timeline>
                {totalCount > comments.length && <Button type="primary" style={{ marginTop: 16 }} onClick={handleLoadMore} loading={loading}>
                    Load More
                </Button>}
            </div>
        </div>
    )
}

export default CommentsTimeLine