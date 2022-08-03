import { Box, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';


export interface IIssueList {
    repoUrl: string;
}

const IssueList = ({ repoUrl }: IIssueList) => {

    const [githubApiBaseUrl, setGithubApiBaseUrl] = useState('');
    const [repoInfo, setRepoInfo] = useState<any>();
    const [issueList, setIssueList] = useState([]);

    const [loader, setLoader] = useState(true);

    useEffect(() => {
        if (repoUrl) {
            repoUrl = repoUrl.replace('https://github.com/', '');
            setGithubApiBaseUrl('https://api.github.com/repos/' + repoUrl)
        }
    }, [repoUrl]);

    useEffect(() => {
        if (githubApiBaseUrl) {
            getRepoInfo()
        }
    }, [githubApiBaseUrl])


    const getRepoInfo = async () => {
        if (githubApiBaseUrl) {
            try {
                setLoader(true);
                const response = await axios.get(githubApiBaseUrl);
                setRepoInfo(response.data);
                await getIssueList();
                setLoader(false);
                console.log({ response })
            } catch (error: any) {
                setLoader(false);
                toast.error(error.message);
            }
        }
    }


    const getIssueList = async () => {
        if (githubApiBaseUrl) {
            try {
                const response = await axios.get(githubApiBaseUrl + '/issues');
                setIssueList(response.data);
            } catch (error: any) {
                setLoader(false);
                toast.error(error.message);
            }
        }
    }

    return (
        <div>
            {
                loader &&
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
            }


            {
                !loader && repoInfo && <Box>
                    <Text fontSize={'4xl'}>
                        Issue list from {repoInfo.name}
                    </Text>
                </Box>
            }
        </div>
    )
}

export default IssueList