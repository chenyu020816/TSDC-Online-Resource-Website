import React from 'react';
import { useSelector } from "react-redux";
import * as resourceAPIs from 'apis/resource';
import { Box, Grid, Skeleton } from '@mui/material';

import { ASYNC_STATUS_ERROR, ASYNC_STATUS_LOADED, ASYNC_STATUS_LOADING } from "utils/asyncStatus.constants";
import CourseCardRoadMap from 'pages/Home/components/Course/CourseCardRoadMap';
import { handleParentExpand } from 'reactflow';


const RecommendResourseSlide = ({ data, index }) => {
    const user_id = localStorage.getItem('YFCII_USER_ID');
    const [courseDataList, setCourseDataList] = React.useState([]);
    const { table, asyncStatusGetTable } = useSelector((store) => store.searchTable);
    const [asyncStatusRecommend, setAsyncStatusRecommend] = React.useState(ASYNC_STATUS_LOADING);

    React.useEffect(() => {
        console.log(courseDataList);
        if (asyncStatusGetTable.loading) return;

        const updatedArray = courseDataList.map((item, i) => ({
            ...item,
            search_id: table[index][i]
        }));
        console.log(updatedArray);
        setCourseDataList(updatedArray)
    }, [table])

    React.useEffect(() => {
        setAsyncStatusRecommend(ASYNC_STATUS_LOADING)
        resourceAPIs.courseSuggestList({ keyword: data }).then((res) => {
            let parameter;
            if (user_id) {
                parameter = { 'user_id': user_id, 'resource_list': res['data']['data'] }
            } else {
                parameter = { 'resource_list': res['data']['data'] }
            }
            resourceAPIs.searchResource(parameter).then((res) => {
                console.log(res['data']['data']);
                setCourseDataList(res['data']['data'])
                setAsyncStatusRecommend(ASYNC_STATUS_LOADED);
            })
        })
    }, [])

    return (
        <div style={{ overflowX: 'auto', width: '100%' }}>
            <div style={{ display: 'flex', padding: '16px 0' }}>
                {!asyncStatusRecommend.loading ? (
                    courseDataList.map((item, index) => (
                        <div style={{ flex: '0 0 auto', marginRight: '16px' }} key={index}>
                            <CourseCardRoadMap data={item} />
                        </div>
                    ))
                ) : (
                    [1, 2, 3, 4].map((index) => (
                        <Grid item key={index} pl={2}>
                            <Skeleton variant="rounded" width="450px" height={300} />
                        </Grid>
                    ))
                )}
            </div>
        </div>
    )
}

export default RecommendResourseSlide
