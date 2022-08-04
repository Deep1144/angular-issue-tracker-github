import { Avatar, Card } from 'antd'
import React from 'react'
import ReactMarkdown from 'react-markdown';
import { IComments } from '../models/comment'

const { Meta } = Card;

const CommentCard = ({ comment }: { comment: IComments }) => {
    return (
        <Card>
            <Meta
                avatar={<Avatar src={comment.user.avatar_url} />}
                title={<p>{comment.user.login} <span className='text-gray-500 text-xs'> Commented on  {new Date(comment.created_at).toDateString()}</span></p>}
                description={
                    <ReactMarkdown>{comment.body}</ReactMarkdown>
                }
            />
        </Card>
    )
}

export default CommentCard