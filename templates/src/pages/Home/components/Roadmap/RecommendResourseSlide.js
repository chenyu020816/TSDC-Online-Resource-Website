import React from 'react';
import * as resourceAPIs from 'apis/resource';
import CourseCardRoadMap from 'pages/Home/components/Course/CourseCardRoadMap';


const RecommendResourseSlide = ({ data }) => {
    const [courseDataList, setCourseDataList] = React.useState([]);

    React.useEffect(() => {
        console.log(data);
        resourceAPIs.courseSuggestList({ keyword: data }).then((res) => {
            console.log(res['data']['data']);
            resourceAPIs.searchResource({ 'resource_list': res['data']['data'] }).then((res) => {
                console.log(res['data']['data']);
                setCourseDataList(res['data']['data'])
            })
        })
    }, [data])

    return (
        <div style={{ overflowX: 'auto', width: '100%' }}>
            <div style={{ display: 'flex', padding: '16px 0' }}>
                {courseDataList ? (courseDataList.map((item, index) => (
                    <div style={{ flex: '0 0 auto', marginRight: '16px' }} key={index}>
                        <CourseCardRoadMap data={item} />
                    </div>
                ))) : ("")}
            </div>
        </div>
    )
}

export default RecommendResourseSlide
