import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { css } from '@emotion/css/macro';
import { styled } from '@mui/material/styles';
import { withStyles } from "@material-ui/core/styles";
import { Box, Table, TableBody, TableContainer } from '@mui/material';
import { TableCell, TableRow } from '@material-ui/core';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';

import theme from 'components/theme';
import { storeData } from 'utils/snackbar.constants';
import useGetSpotsList from 'hook/useGetSpotsList';
import usePlanConfig from 'hook/usePlanConfig';
import * as spotAPIs from 'apis/spot';
import * as planAPIs from 'apis/plan';
import useGetTagsList from 'hook/useGetTagsList';

const palette = 'Plan';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#F1F5F9",
    '&:hover': {
        backgroundColor: "#F1F5F9",
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '28ch',
            },
        },
    },
}));

const StyledTableRow = withStyles((theme) => ({
    root: {
        height: 35,
        cursor: "pointer"
    }
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
    root: {
        display: "inline-flex",
        padding: "0px 16px",
        borderBottom: "none",
        height: "35px",
        alignItems: "center"
    }
}))(TableCell);

const StyledTableCellStar = withStyles((theme) => ({
    root: {
        padding: "0px 16px",
        borderBottom: "none",
    }
}))(TableCell);

const HeaderSearchBar = () => {
    const elementRef = React.useRef(null);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { handleGetUserPlanTags } = useGetTagsList();
    const { handleAddSpot, getGoogleWayPoints } = usePlanConfig();
    const { getUserPlanSpotId, handleGetSpotsList } = useGetSpotsList();
    const { planInfo, asyncStatusPlanInfo } = useSelector((store) => store.planInfo);
    const { selectedCity, selectedTagSpot, selectedPlanSpot } = useSelector((store) => store.selectedItem);
    const [searched, setSearched] = React.useState('');
    const [rows, setRows] = React.useState([]);
    const [showTable, setShowTable] = React.useState(false);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // 阻止 Enter 鍵的預設行為
        }
    };

    const transferSpotsName = (text) => {
        const truncatedText = text.length > 12 ? `${text.slice(0, 12)}...` : text;
        return truncatedText;
    }

    const requestSearch = (input) => {
        setSearched(input);

        let avoidId = getUserPlanSpotId(selectedPlanSpot)
        spotAPIs.searchSpot({ word: input, avoidId: avoidId }).then((res) => {
            setRows(res['data']['data']);
        });
    };

    const cancelSearch = () => {
        setSearched('');
        requestSearch('');
    };

    const storePlan = (newPlan) => {
        if (asyncStatusPlanInfo.loading) return;
        planAPIs.updatePlanSpot({ _id: planInfo['id'], planContent: newPlan }).then((res) => {
            if (res['data']['success']) {
                enqueueSnackbar(`行程已儲存`, storeData);
            }
        })
    }

    const handleClickSearchSpot = (row) => {
        handleAddSpot(row)
        storePlan(getUserPlanSpotId([...selectedPlanSpot, row]))
        dispatch({ type: "WAY_POINT_LOADED", payload: getGoogleWayPoints([...selectedPlanSpot, row]) });

        const plantagsList = handleGetUserPlanTags([...selectedPlanSpot, row]);
        dispatch({ type: "GET_PLAN_TAGS_LOADED", payload: plantagsList });
        handleGetSpotsList(selectedCity, plantagsList.concat(selectedTagSpot), [...selectedPlanSpot, row]);
        cancelSearch();
    }

    React.useEffect(() => {
        // 監控className
        const targetNode = elementRef.current;

        if (!targetNode) return;

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    setTimeout(() => setShowTable(mutation.target.className.includes('Mui-focused')), 100);
                }
            }
        });
        const observerOptions = {
            attributes: true,
            attributeFilter: ['class'],
        };

        observer.observe(targetNode, observerOptions);
    }, []);

    return (
        <div className={style(theme[palette])}>
            <Box sx={{ display: { xs: "none", sm: "block" }, maxWidth: 600 }}>
                <Search>
                    {searched ? (
                        <IconButton style={{ borderRadius: "0px" }} onClick={() => cancelSearch()}>
                            <CloseIcon style={{ color: "#A2A2A2" }} />
                        </IconButton>
                    ) : (
                        <IconButton disabled>
                            <SearchIcon style={{ color: "#A2A2A2" }} />
                        </IconButton>
                    )}
                    <StyledInputBase
                        placeholder="景點"
                        value={searched}
                        onChange={(e) => requestSearch(e.target.value)}
                        ref={elementRef}
                        inputProps={{ 'aria-label': 'search' }}
                        style={{ color: "#A2A2A2" }}
                        onKeyDown={handleKeyDown}
                    />
                </Search>
            </Box>
            {searched.length && showTable ? (
                <TableContainer className="table">
                    <Table
                        aria-label="custom pagination table"
                    >
                        <TableBody>
                            {rows.map((row) => (
                                <StyledTableRow
                                    key={row.name}
                                    onClick={() => handleClickSearchSpot(row)}
                                >
                                    <StyledTableCell component="th" scope="row" style={{ margin: "0 auto" }}>
                                        <SearchIcon style={{ width: "16px", paddingRight: "5px", color: "gray" }} />
                                        {transferSpotsName(row.name)}
                                    </StyledTableCell>
                                    <StyledTableCellStar
                                        component="th"
                                        scope="row"
                                        align="right"
                                        style={{ color: 'rgb(254, 206, 111)' }}
                                    >
                                        {row.googleInfo.rating}
                                    </StyledTableCellStar>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <></>
            )}
        </div>
    )
}

export default HeaderSearchBar

const style = (palette = theme.Plan) => css`
.table{
    width:33ch;
    top: 62px;
    right: 128px;
    position: absolute;
    z-index: 1000;
    color: ${palette['dark']};
    border-radius: 10px;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
    background-color: white;
}
`