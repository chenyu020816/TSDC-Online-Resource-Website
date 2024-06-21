import React from 'react';
import { useSnackbar } from 'notistack';
import { css } from '@emotion/css/macro';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Stack, Grid, Typography, TextareaAutosize } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import Avatar from '@mui/material/Avatar';
import theme from 'components/theme';
import { storeData } from 'utils/snackbar.constants';
import MultipleSelectChip from 'components/MultipleSelectorKeyword';
import * as postAPIs from 'apis/post';

const palette = 'home';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const DialogCreatePost = ({ open, setOpen, handleClose }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [avatarColor] = React.useState(getRandomColor());
    const [userId, setUserId] = React.useState(null);
    const [userName, setUserName] = React.useState(null);
    const [keywordList, setKeywordList] = React.useState([]);
    const [selectedKeywordList, setSelectedKeywordList] = React.useState([]);
    const [articleTitle, setArticleTitle] = React.useState("");
    const [articleBody, setArticleBody] = React.useState("");

    const handleInputChangeTitle = (event) => {
        setArticleTitle(event.target.value)
    }

    const handleInputChangeBody = (event) => {
        setArticleBody(event.target.value)
    }

    const handlePublishPost = () => {
        postAPIs.createUserPost({ "user_id": userId, "title": articleTitle, "body": articleBody, "keywords": selectedKeywordList }).then((res) => {
            handleClose();
            console.log(res);
            if (res['data']['success']) {
                enqueueSnackbar(`文章已成功發布`, storeData);
                setArticleTitle("");
                setArticleBody("");
                setSelectedKeywordList([]);
                /* [TODO] */
            }
        })
    }


    React.useEffect(() => {
        setUserId(localStorage.getItem('YFCII_USER_ID'))
        setUserName(localStorage.getItem('YFCII_USER_NAME'))
    }, [])

    React.useEffect(() => {
        postAPIs.getPostKeyword().then((res) => {
            setKeywordList(res['data']['data']['chi'])
        })
    }, [])


    React.useEffect(() => {
        console.log(userId);
        console.log(selectedKeywordList);
        console.log(articleTitle);
        console.log(articleBody);
    }, [userId, selectedKeywordList, articleTitle, articleBody])

    return (
        <>
            <BootstrapDialog
                className={dialog()}
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    <Grid container direction="column" alignItems="center" >
                        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }} >
                            建立貼文
                        </Typography>
                    </Grid>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Stack direction="row" justifyContent="left" alignItems="center" py={1}>
                        <Avatar sx={{ bgcolor: avatarColor, width: 45, height: 45 }} aria-label="recipe">
                            {userName ? userName.charAt(0).toUpperCase() : "--"}
                        </Avatar>
                        <InputBase
                            sx={{ ml: 3, flex: 1 }}
                            placeholder="文章標題"
                            inputProps={{ 'aria-label': 'search google maps' }}
                            value={articleTitle}
                            onChange={handleInputChangeTitle}
                        />
                    </Stack>
                </DialogContent>
                <DialogContent dividers>
                    <MultipleSelectChip data={keywordList} selectedKeywordList={selectedKeywordList} setSelectedKeywordList={setSelectedKeywordList} />
                </DialogContent>
                <DialogContent dividers className='body-input'>
                    <InputBase
                        sx={{ ml: 3, flex: 1, width: "90%" }}
                        placeholder="想分享什麼內容呢？"
                        inputProps={{ 'aria-label': '文章標題', component: TextareaAutosize }}
                        multiline
                        minRows={4} // 設定初始顯示的行數
                        value={articleBody}
                        onChange={handleInputChangeBody}
                    />
                </DialogContent>
                <DialogActions>
                    <Button className='button-diolog' onClick={handlePublishPost}>
                        發布
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    )
}

export default DialogCreatePost

const dialog = (palette = theme.CreatePlan) => css`
.MuiPaper-root.MuiPaper-elevation{
    min-width: 60%;
    //height: 65%;
}

.button-diolog{
  font-weight: bold;
  font-size: 16px;
  color: #599cdf;
  box-shadow: none;
  background-color: white;
  &:hover{
    background-color: #f6fafd;
    box-shadow: none;
  }
}
 
@media screen and (max-width: 600px) {
    .MuiDialogContent-root.MuiDialogContent-dividers{
        padding: 8px;
    }
    .MuiPaper-root.MuiPaper-elevation{
        width: 95%;
        margin: 0px;
    }
}
`