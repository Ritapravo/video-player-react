import { React, useState, useRef } from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Button, IconButton } from '@mui/material';
import ReactPlayer from 'react-player';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Slider, { SliderThumb } from '@mui/material/Slider';
// import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
// import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import Popover from '@mui/material/Popover';
import screenfull from 'screenfull';
import Paper from '@mui/material/Paper';
import { dummyCheckPoints } from './dummy';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const format = (seconds) => {
    if (isNaN(seconds)) {
        return `00:00`;
    }
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
        return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
};

function valuetext(value) {
    return `${value}°C`;
}

const useStyles = {
    playerWrapper: {
        width: '100%',
        position: 'relative',
    },

    controlWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 1,
    },

    controlIcons: {
        color: '#777',
        fontSize: 50,
        transform: 'scale(0.9)',
        '&:hover': {
            color: '#fff',
            transform: 'scale(1)',

        }
    },
    bottomIcons: {
        color: "#999",
        '&:hover': {
            color: '#fff',
        }

    },
    volumeSlider: {
        width: "100",
    }
};
function ValueLabelComponent(props) {
    const { children, value, ellapsedTime } = props;
    // console.log(value);
    return (
        <Tooltip enterTouchDelay={0} placement="top" title={"value"}>
            {children}
        </Tooltip>
    );
}
ValueLabelComponent.propTypes = {
    // children: PropTypes.element.isRequired,
    value: PropTypes.string.isRequired,
};
// const PrettoSlider = styled(Slider)({
//     // color: '#52af77',
//     height: 8,
//     '& .MuiSlider-track': {
//         border: 'none',
//     },
//     '& .MuiSlider-thumb': {
//         height: 24,
//         width: 24,
//         backgroundColor: '#fff',
//         border: '2px solid currentColor',
//         '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
//             boxShadow: 'inherit',
//         },
//         '&:before': {
//             display: 'none',
//         },
//     },
//     '& .MuiSlider-valueLabel': {
//         lineHeight: 1.2,
//         fontSize: 12,
//         background: 'unset',
//         padding: 0,
//         width: 32,
//         height: 32,
//         borderRadius: '50% 50% 50% 0',
//         backgroundColor: '#52af77',
//         transformOrigin: 'bottom left',
//         transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
//         '&:before': { display: 'none' },
//         '&.MuiSlider-valueLabelOpen': {
//             transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
//         },
//         '& > *': {
//             transform: 'rotate(45deg)',
//         },
//     },


// });

let count = 0;

const VideoPlayer2 = () => {
    const classes = useStyles;
    const [anchorEl, setAnchorEl] = useState(null);
    const [state, setState] = useState({
        playing: true,
        muted: true,
        volume: 0.5,
        playbackRate: 1.0,
        played: 0,
        seeking: false,
        timeDisplayFormat: 'normal',
    });

    const [bookmarks, setBookmarks] = useState([]);
    const addBookmark = () => {
        console.log(bookmarks);
        const canvas = canvasRef.current;
        canvas.width = 160;
        canvas.height = 90;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
            playerRef.current.getInternalPlayer(),
            0,
            0,
            canvas.width,
            canvas.height
        );
        const imageUrl = canvas.toDataURL();
        canvas.width = 0;
        canvas.height = 0;
        const bookmarksCopy = [...bookmarks];
        bookmarksCopy.push({
            time: playerRef.current.getCurrentTime(),
            display: format(playerRef.current.getCurrentTime()),
            image: imageUrl,
        });
        setBookmarks(bookmarksCopy);



    }

    const { playing, muted, volume, playbackRate, played, seeking, timeDisplayFormat } = state;

    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);
    const canvasRef = useRef(null);
    const controlsRef = useRef (null)


    const handlePlayPause = () => {
        setState({ ...state, playing: !state.playing })
    }

    const handleRewind = () => {
        // console.log(playerRef.current.getCurrentTime());
        playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
    }
    const handleFastForward = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
        // console.log(playerRef.current.getCurrentTime());
    }

    const handlePopover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMute = () => {
        setState({ ...state, muted: !state.muted });
    }

    const handleVolumeChange = (e, newValue) => {
        setState({
            ...state,
            volume: parseFloat(newValue / 100),
            muted: newValue === 0 ? true : false,
        })
    };

    const handleVolumeSeekUp = (e, newValue) => {
        setState({
            ...state,
            volume: parseFloat(newValue / 100),
            muted: newValue === 0 ? true : false,
        })
    }

    const handlePLaybackRateChange = (rate) => {
        setState({ ...state, playbackRate: rate });
        handleClose();
    }

    const toggleFullScreen = () => {
        screenfull.toggle(playerContainerRef.current);
    }

    const handleProgress = (changeState) => {
        if (!seeking)
            setState({ ...state, ...changeState })
        if (count > 2) {
            controlsRef.current.style.visibility = "hidden";
            count = 0;
          }
          if (controlsRef.current.style.visibility == "visible") {
            count += 1;
          }
        // console.log(count);
    }

    const handleSeekChange = (e, newValue) => {
        setState({ ...state, played: parseFloat(newValue / 100) });

    };
    const handleSeekMouseDown = (e, newValue) => {
        // console.log("seekmouseDown");
        setState({ ...state, seeking: true });
    };

    const handleSeekMouseUp = (e, newValue) => {
        // console.log("seekmouseUp");
        setState({ ...state, seeking: false });
        playerRef.current.seekTo(newValue / 100);
    }

    const handleChangeDisplayFormat = () => {
        setState({ ...state, timeDisplayFormat: timeDisplayFormat === 'normal' ? 'remaining' : 'normal' });
    }

    const handleMouseMove = () => {
        controlsRef.current.style.visibility = 'visible';
        count = 0;
    }

    const open = Boolean(anchorEl);
    const id = open ? "playbackrate-popover" : undefined;

    const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : '00:00';
    const duration = playerRef.current ? playerRef.current.getDuration() : '00:00';
    const ellapsedTime = timeDisplayFormat === 'normal' ? format(currentTime) : `-${format(duration - currentTime)}`;
    const totalDuration = format(duration);

    return (<>
        {/* <AppBar position='fixed'>
            <Toolbar>
                <Typography variant='h6'>Bodhitree Video Player</Typography>
            </Toolbar>
        </AppBar> */}
        <Toolbar />
        <div >
        <TextField
          id="standard-select-currency"
          select
          label="Select"
        //   defaultValue="EUR"
          helperText="Checkpoints"
          variant="standard"
          style={{width:'40%', }}
          
        >
          {dummyCheckPoints.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.name} {option.display}
            </MenuItem>
          ))}
        </TextField>
            <div ref={playerContainerRef} style={classes.playerWrapper} onMouseMove={handleMouseMove}>
                {/* TOP CONTROLS */}
                <ReactPlayer
                    ref={playerRef}
                    width={'100%'}
                    height={'100%'}
                    url={'videos/video2.mp4'}
                    muted={muted}
                    playing={playing}
                    volume={volume}
                    playbackRate={playbackRate}
                    onProgress={handleProgress}
                    config={{
                        file: {
                            attributes: {
                                crossOrigin: 'anonymous'
                            }
                        }
                    }}
                    
                />

                <div style={classes.controlWrapper} ref={controlsRef}>
                    <Grid container direction={"row"} alignItems="center" justifyContent="space-between" style={{ padding: 16 }}>
                        <Grid item>
                            <Typography variant='h5' style={{ color: 'white' }}>Video Title</Typography>
                        </Grid>

                        <Grid item>
                            <Button
                                size='small'
                                variant="contained"
                                color="primary"
                                startIcon={<BookmarkIcon />}
                                style={{ float: "right" }}
                                onClick={addBookmark}
                            >

                                Bookmark
                            </Button>

                        </Grid>
                    </Grid>

                    {/* MIDDLE CONTROLS */}

                    <Grid container direction={"row"} alignItems="center" justifyContent="center">

                        <IconButton onClick={handleRewind} style={classes.controlIcons} aria-label="reqind">
                            <FastRewindIcon fontSize="large" />
                        </IconButton>

                        <IconButton onClick={handlePlayPause} style={classes.controlIcons} aria-label="reqind">
                            {playing ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}

                        </IconButton>

                        <IconButton onClick={handleFastForward} style={classes.controlIcons} aria-label="reqind">
                            <FastForwardIcon fontSize="large" />
                        </IconButton>

                    </Grid>

                    {/* bottom controls */}
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        style={{ padding: 16 }}
                    >
                        <Grid item xs={12}>
                            <Slider
                                // size='small'
                                min={0}
                                max={100}
                                value={played * 100}
                                getAriaValueText={valuetext}
                                valueLabelDisplay="auto"
                                aria-label="custom thumb label"
                                onChange={handleSeekChange}
                                onMouseDown={handleSeekMouseDown}
                                onChangeCommitted={handleSeekMouseUp}
                            />

                        </Grid>

                        <Grid item xs={9} md={9}>
                            <Grid container alignItems="center" >

                                <Grid item >
                                    <IconButton onClick={handlePlayPause} style={classes.bottomIcons}>
                                        {playing ? <PauseIcon fontSize="medium" /> : <PlayArrowIcon fontSize="medium" />}
                                    </IconButton>

                                    <IconButton onClick={handleMute} style={classes.bottomIcons}>
                                        {muted ? <VolumeOffIcon fontSize='medium' /> : <VolumeUpIcon fontSize="medium" />}
                                    </IconButton>
                                </Grid>
                                <Grid item xs={2} md={2}>
                                    <Slider
                                        size='small'
                                        min={0}
                                        max={100}
                                        defaultValue={100}
                                        style={classes.volumeSlider}
                                        onChange={handleVolumeChange}
                                        onChangeCommitted={handleVolumeSeekUp}
                                    />
                                </Grid>

                                <Button variant="text" style={{ color: "#fff", marginLeft: 16 }}>
                                    <Typography onClick={handleChangeDisplayFormat}>{ellapsedTime}/{totalDuration}</Typography>
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid item xs={3} md={3}>
                            <IconButton onClick={toggleFullScreen}  style={{ ...classes.bottomIcons, float: "right", transform: "translate(0,-11%)" }}>
                                <FullscreenIcon fontSize="medium" />
                            </IconButton>
                            <Button
                                onClick={handlePopover}
                                variant="text"
                                style={{...classes.bottomIcons, float: "right" }}
                            >
                                <Typography color={'white'}>{playbackRate}X</Typography>
                            </Button>

                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                }}
                                transformOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                }}
                            >
                                <Grid container direction="column-reverse">
                                    {[0.5, 1, 1.5, 2].map((rate) => (
                                        <Button variant="text" onClick={() => handlePLaybackRateChange(rate)} key={rate}>
                                            <Typography color={rate === playbackRate ? "secondary" : "default"}>{rate}</Typography>
                                        </Button>
                                    ))}
                                </Grid>
                            </Popover>

                        </Grid>

                    </Grid>
                </div>
            </div>
            <Grid container style={{ marginTop: 20 }} spacing={3}>
                {bookmarks.map((bookmark, index) => (
                    <Grid key={index} item>
                        <Paper
                            onClick={() => {
                                playerRef.current.seekTo(bookmark.time);
                                // controlsRef.current.style.visibility = "visible";

                                // setTimeout(() => {
                                //     controlsRef.current.style.visibility = "hidden";
                                // }, 1000);
                            }}
                            elevation={3}
                        >
                            <img crossOrigin="anonymous" src={bookmark.image} />
                            <Typography variant="body2" align="center">
                                bookmark at {bookmark.display}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <canvas ref={canvasRef} />
        </div>

    </>)
}

export { VideoPlayer2 }