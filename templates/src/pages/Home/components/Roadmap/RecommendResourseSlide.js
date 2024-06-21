import React from 'react';
import * as resourceAPIs from 'apis/resource';
import { Box, Grid, Skeleton } from '@mui/material';

import { ASYNC_STATUS_ERROR, ASYNC_STATUS_LOADED, ASYNC_STATUS_LOADING } from "utils/asyncStatus.constants";
import CourseCardRoadMap from 'pages/Home/components/Course/CourseCardRoadMap';


const RecommendResourseSlide = ({ data }) => {
    const [courseDataList, setCourseDataList] = React.useState([]);
    const [asyncStatusRecommend, setAsyncStatusRecommend] = React.useState(ASYNC_STATUS_LOADING);

    React.useEffect(() => {
        console.log(data);
        setAsyncStatusRecommend(ASYNC_STATUS_LOADING)
        resourceAPIs.courseSuggestList({ keyword: data }).then((res) => {
            resourceAPIs.searchResource({ 'resource_list': res['data']['data'] }).then((res) => {
                console.log(res['data']['data']);
                setCourseDataList(res['data']['data'])
                setAsyncStatusRecommend(ASYNC_STATUS_LOADED);
            })
        })
    }, [data])

    return (
        <div style={{ overflowX: 'auto', width: '100%' }}>
            <div style={{ display: 'flex', padding: '16px 0' }}>
                {!asyncStatusRecommend.loading ? (courseDataList.map((item, index) => (
                    <div style={{ flex: '0 0 auto', marginRight: '16px' }} key={index}>
                        <CourseCardRoadMap data={item} />
                    </div>
                ))) : (
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
