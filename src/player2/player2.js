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
import classes from './player.module.css'

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


let count = 0;

const VideoPlayer2 = () => {
    // const classes = useStyles;
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
    const controlsRef = useRef(null)


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

        <div >
            <TextField
                id="standard-select-currency"
                select
                label="Select"
                //   defaultValue="EUR"
                helperText="Checkpoints"
                variant="standard"
                style={{ width: '40%', }}

            >
                {dummyCheckPoints.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.name} {option.display}
                    </MenuItem>
                ))}
            </TextField>
            <div ref={playerContainerRef} className={classes.playerWrapper} onMouseMove={handleMouseMove}>
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

                <div className={classes.controlWrapper} ref={controlsRef}>
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

                        <IconButton onClick={handleRewind} className={classes.controlIcons} aria-label="reqind">
                            <FastRewindIcon fontSize="large" />
                        </IconButton>

                        <IconButton onClick={handlePlayPause} className={classes.controlIcons} aria-label="reqind">
                            {playing ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}

                        </IconButton>

                        <IconButton onClick={handleFastForward} className={classes.controlIcons} aria-label="reqind">
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

                        <Grid item xs={8} md={9}>
                            <Grid container alignItems="center" >

                                <Grid item >
                                    <IconButton onClick={handlePlayPause} className={classes.bottomIcons}>
                                        {playing ? <PauseIcon fontSize="medium" /> : <PlayArrowIcon fontSize="medium" />}
                                    </IconButton>

                                    <IconButton onClick={handleMute} className={classes.bottomIcons}>
                                        {muted ? <VolumeOffIcon fontSize='medium' /> : <VolumeUpIcon fontSize="medium" />}
                                    </IconButton>
                                </Grid>
                                <Grid item xs={4} md={2}>
                                    <Slider
                                        size='small'
                                        min={0}
                                        max={100}
                                        defaultValue={100}
                                        className={classes.volumeSlider}
                                        onChange={handleVolumeChange}
                                        onChangeCommitted={handleVolumeSeekUp}
                                    />
                                </Grid>

                                <Button variant="text" style={{ color: "#fff", marginLeft: 16 }}>
                                    <Typography onClick={handleChangeDisplayFormat}>{ellapsedTime}/{totalDuration}</Typography>
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid item xs={4} md={3}>
                            <IconButton onClick={toggleFullScreen} className={classes.bottomIcons} style={{   transform: "translate(0,-11%)" }}>
                                <FullscreenIcon fontSize="medium" />
                            </IconButton>
                            <Button
                                onClick={handlePopover}
                                variant="text"
                                className={classes.bottomIcons}
                                // style={{ float: "right" }}
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
            <div className={classes.containerOuter} style={{ minWidth: '100%', padding: '0% 0%' }}>
                <div className={classes.containerInner}>
                    {bookmarks.map((bookmark, index) => (
                        <div className={classes.tileStyle} >
                            <Paper

                                onClick={() => {
                                    playerRef.current.seekTo(bookmark.time);
                                    // controlsRef.current.style.visibility = "visible";

                                    // setTimeout(() => {
                                    //     controlsRef.current.style.visibility = "hidden";
                                    // }, 1000);
                                }}
                                elevation={1}
                            >
                                <img crossOrigin="anonymous" src={bookmark.image} width='100%' />
                            </Paper>
                                <p style={{color:'blue'}}>
                                    {bookmark.display}
                                </p>
                                <p style={{textAlign:'left'}}>
                                    {/* <span style={{color:'blue'}}>{bookmark.display}</span>  */}
                                    Introduction to a new topic. This is great
                                </p>
                        </div>
                    ))}
                </div>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

    </>)
}

export { VideoPlayer2 }