import { React, useState, useRef, useEffect } from 'react';
import { Typography, Container, Grid, Button, IconButton } from '@mui/material';
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
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import Popover from '@mui/material/Popover';
import screenfull from 'screenfull';
import Paper from '@mui/material/Paper';
import { dummyCheckPoints, getLocalStorage } from './dummy';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import classes from './player.module.css'
import { useLocalStorage, setLocalStorage } from './dummy';
import EditQuiz from './editQuiz';

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

const valuetext = (value) => {
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

const InstructorVideoPlayer = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [state, setState] = useState({
        playing: true,
        muted: true,
        volume: 0.5,
        playbackRate: 1.0,
        played: 0,
        timeDisplayFormat: 'normal',
    });

    const [seeking, setSeeking] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const [showBookmarks, setShowBookmarks] = useState(true);
    const [showAddMaker, setShowAddMaker] = useState(false);
    const [markerEntry, setMarkerEntry] = useState({ type: "Section Marker", title: "" });
    const [showEditMarker, setShowEditMarker] = useState(false);
    const [editMarkerFields, setEditMarkerFields] = useState({ title: "" });

    const handleChangeMarkerEntry = (e) => {
        setMarkerEntry({ ...markerEntry, [e.target.name]: e.target.value });
    }

    const addBookmark = (title = "", type = "Section Marker") => {
        setState({ ...state, playing: false })
        let current_time = format(playerRef.current.getCurrentTime());
        if (bookmarks.map((i) => (i.display)).includes(current_time)) {
            alert("already bookmarked at this timestamp");
            return;
        }
        // console.log(bookmarks.map((i)=>(i.display)));
        console.log(playerRef);
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
            value: (playerRef.current.getCurrentTime() * 100) / playerRef.current.getDuration(),
            title: title,
            type: type,
            quiz: {},
        });
        bookmarksCopy.sort((a, b) => {
            if (a['time'] < b['time']) {
                return -1;
            }
            if (a['time'] > b['time']) {
                return 1;
            }
            return 0;
        });

        playerRef.current.seekTo(playerRef.current.getCurrentTime() + 0.8);
        setLocalStorage("bookmarks", bookmarksCopy);
        setBookmarks(bookmarksCopy);

    }

    const { playing, muted, volume, playbackRate, played, timeDisplayFormat } = state;

    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);
    const canvasRef = useRef(null);
    const controlsRef = useRef(null);
    const sliderRef = useRef(null);
    const quizContainerRef = useRef(null);


    const handlePlayPause = () => {
        setState({ ...state, playing: !state.playing })
    }

    const handleRewind = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
    }
    const handleFastForward = () => {
        for (let i in bookmarks) {
            console.log(bookmarks[i].time, playerRef.current.getCurrentTime());
            if (bookmarks[i].time > playerRef.current.getCurrentTime() && bookmarks[i].time < playerRef.current.getCurrentTime() + 10) {
                playerRef.current.seekTo(bookmarks[i].time - 1);
                // console.log(bookmarks[i].time, playerRef.current.getCurrentTime());
                return;
            }
        }
        playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
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
        if (!seeking) {
            setState({ ...state, ...changeState });
            sliderRef.current.childNodes[sliderRef.current.childNodes.length - 1].childNodes[1].childNodes[0].innerText = format(currentTime);
        }

        if (count > 2) {
            controlsRef.current.style.visibility = "hidden";
            count = 0;
        }
        if (controlsRef.current.style.visibility == "visible") {
            count += 1;
        }

        // for (let i in bookmarks) {
        //     if (bookmarks[i].type==="Quiz Marker" && bookmarks[i].display === format(playerRef.current.getCurrentTime())) {
        //         quizContainerRef.current.style.visibility = "visible";
        //         setState({ ...state, playing: false });
        //         playerRef.current.seekTo(playerRef.current.getCurrentTime() + 0.8);
        //     }
        // }

    }

    const handleSeekChange = (e, newValue) => {

        // console.log(sliderRef.current.childNodes[2].childNodes[1].childNodes[0].innerText);
        if (!seeking)
            setSeeking(true);
        sliderRef.current.childNodes[sliderRef.current.childNodes.length - 1].childNodes[1].childNodes[0].innerText = format((newValue * playerRef?.current.getDuration()) / 100);
        setState({ ...state, played: parseFloat(newValue / 100) });

    };
    const handleSeekMouseDown = (e, newValue) => {
        setSeeking(true);
        // console.log("mouse Down", seeking);
    };

    const handleSeekMouseUp = (e, newValue) => {
        sliderRef.current.childNodes[sliderRef.current.childNodes.length - 1].childNodes[1].childNodes[0].innerText = format((newValue * playerRef?.current.getDuration()) / 100);
        setSeeking(false);
        // console.log("mouse Up", playerRef);
        playerRef.current.seekTo(newValue / 100);
    }

    const handleChangeDisplayFormat = () => {
        setState({ ...state, timeDisplayFormat: timeDisplayFormat === 'normal' ? 'remaining' : 'normal' });
    }

    const handleMouseMove = () => {
        controlsRef.current.style.visibility = 'visible';
        count = 0;
    }

    const handleAddSectionMarker = () => {

        if (markerEntry.type === "Section Marker") {
            addBookmark(markerEntry.title, markerEntry.type);
            setMarkerEntry({ type: "Section Marker", title: "" });
            setShowAddMaker(false);
            console.log(markerEntry);
        }
        else {
            addBookmark(markerEntry.title, markerEntry.type);
            setMarkerEntry({ type: "Quiz Marker", title: "" });
            setShowAddMaker(false);
            console.log(markerEntry);
        }
    }

    const handleUpdateSectionMarker = () => {
        let temp = [...bookmarks];
        for (let i in bookmarks) {
            if (temp[i].display === editMarkerFields.display) {
                temp[i].title = editMarkerFields.title;
            }
        }
        setBookmarks(temp);
        setShowEditMarker(false);
        setLocalStorage("bookmarks", temp);
    }

    const handleBookmarkClicked = (bookmark) => {
        if (showEditMarker) return;
        playerRef.current.seekTo(bookmark.time);
        setState({ ...state, playing: false });
        // setShowBookmarks(false);
        setShowAddMaker(false);
        setShowEditMarker(true);
        setEditMarkerFields({ ...bookmark });

    }


    const open = Boolean(anchorEl);
    const id = open ? "playbackrate-popover" : undefined;

    const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : '00:00';
    const duration = playerRef.current ? playerRef.current.getDuration() : '00:00';
    const ellapsedTime = timeDisplayFormat === 'normal' ? format(currentTime) : `-${format(duration - currentTime)}`;
    const totalDuration = format(duration);

    const tempBookmarks = useLocalStorage("bookmarks");
    useEffect(() => {
        console.log(tempBookmarks);
        if (tempBookmarks)
            setBookmarks([...tempBookmarks]);
    }, [tempBookmarks])


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
                value=""

            >
                {bookmarks?.map((option) => (
                    <MenuItem key={option.time} value={option.value} title={option.title}
                        onClick={() => { handleBookmarkClicked(option); }}
                    >
                        {option.title.slice(0, 30)} {option.title.length > 30 ? "..." : ""} {option.display}
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
                    <Grid container direction={"row"} alignItems="center" justifyContent="space-between" className={classes.upperControls}>
                        <Grid item className={classes.videoTitle}>
                            <h2 style={{ color: 'white' }}>Video Title</h2>
                        </Grid>

                        <Grid item>
                            <Button
                                size='small'
                                variant="contained"
                                color="primary"
                                startIcon={<BookmarkIcon />}
                                style={{ float: "right" }}
                                onClick={handleAddSectionMarker}

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
                        className={classes.lowerGrid}
                    >
                        <Grid item xs={12}>
                            <Slider
                                size={`${window.screen.width > 500 ? 'medium' : 'small'}`}
                                min={0}
                                max={100}
                                value={played * 100}
                                valueLabelDisplay="auto"
                                step={1}
                                getAriaValueText={() => valuetext(played * 100)}
                                // aria-label="custom thumb label"
                                onChange={handleSeekChange}
                                onMouseDown={handleSeekMouseDown}
                                onChangeCommitted={handleSeekMouseUp}
                                className={classes.slider}
                                ref={sliderRef}
                                marks={bookmarks}
                            />

                        </Grid>

                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div style={{ minWidth: '60%', display: 'flex', alignItems: 'center' }}>
                                <IconButton onClick={handlePlayPause} className={classes.bottomIcons}>
                                    {playing ? <PauseIcon fontSize="medium" /> : <PlayArrowIcon fontSize="medium" />}
                                </IconButton>

                                <IconButton onClick={handleMute} className={classes.bottomIcons}>
                                    {muted ? <VolumeOffIcon fontSize='medium' /> : <VolumeUpIcon fontSize="medium" />}
                                </IconButton>

                                <Slider
                                    size='small'
                                    min={0}
                                    max={100}
                                    defaultValue={100}
                                    className={classes.volumeSlider}
                                    onChange={handleVolumeChange}
                                    onChangeCommitted={handleVolumeSeekUp}

                                    style={{ width: '15%', padding: '8 0' }}

                                />
                                {/* current -> children[2] -> childNodes[1] -> innerText */}
                                {/* current -> childNodes[2] -> childNodes[1] -> childNodes[0] -> innerText */}

                                <Button variant="text" style={{ color: "#fff", marginLeft: 16 }}>
                                    <Typography onClick={handleChangeDisplayFormat}>{ellapsedTime}/{totalDuration}</Typography>
                                </Button>

                            </div>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    onClick={handlePopover}
                                    variant="text"
                                    className={classes.bottomIcons}
                                // style={{ float: "right" }}
                                >
                                    <Typography >{playbackRate}X</Typography>
                                </Button>
                                <IconButton onClick={toggleFullScreen} className={classes.bottomIcons}
                                // style={{float:'right'}}
                                >
                                    <FullscreenIcon fontSize="medium" />
                                </IconButton>
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
                                    style={{ zIndex: '4' }}
                                >
                                    <Grid container direction="column-reverse">
                                        {[0.5, 1, 1.5, 2].map((rate) => (
                                            <Button variant="text" onClick={() => handlePLaybackRateChange(rate)} key={rate}>
                                                <Typography color={rate === playbackRate ? "secondary" : "default"}>{rate}</Typography>
                                            </Button>
                                        ))}
                                    </Grid>
                                </Popover>
                            </div>
                        </div>

                        <div style={{ display: 'inline-block', width: '25%' }}></div>



                    </Grid>
                </div>
                <div className={classes.quizWrapper} ref={quizContainerRef}>
                    <div className={classes.quiz}>

                    </div>
                    <Button variant={'text'} className={classes.skipButton} onClick={() => { setState({ ...state, playing: true }); quizContainerRef.current.style.visibility = "hidden" }}>skip</Button>

                </div>
            </div>

            {/* <div className={classes.addMarker}>

            </div> */}
            <div className={classes.markerContainer}>
                <div className={classes.addBookmark}>
                    {!showEditMarker ?
                        <>
                            <Button variant="text" onClick={() => { setState({ ...state, playing: false }); setShowAddMaker(!showAddMaker) }}>Add Marker/Quiz</Button>
                            <Button variant="text" onClick={() => { setShowBookmarks(!showBookmarks) }}>{showBookmarks ? "Hide Bookmarks" : "Show Bookmarks"}</Button>
                        </>
                        :
                        <>
                            <Button color="error" onClick={() => { setBookmarks(bookmarks.filter(item => item.display != editMarkerFields.display)); setShowEditMarker(false) }}>{"delete"}</Button>
                            <Button variant="text" onClick={() => { setShowEditMarker(false) }}>{"cancel"}</Button>
                        </>
                    }
                </div>

                {showAddMaker &&
                    <div className={classes.addMarker}>
                        <div className={classes.markerSelect}>
                            <TextField
                                select
                                InputProps={{ disableUnderline: true }}
                                className={classes.textField}
                                placeholder={'Select Doctor'}
                                variant="standard"
                                value={markerEntry.type}
                                name={"type"}
                                onChange={handleChangeMarkerEntry}
                                style={{ padding: "0 1vw" }}
                            >
                                {["Section Marker", "Quiz Marker"].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>

                        </div>
                        <div className={classes.markerTitle}>
                            <TextField
                                InputProps={{ disableUnderline: true }}
                                className={classes.textField}
                                placeholder={'Enter Title'}
                                variant="standard"
                                style={{ width: "100%" }}
                                value={markerEntry.title}
                                name={"title"}
                                onChange={handleChangeMarkerEntry}
                            />
                        </div>
                        <div className={classes.addCancel}>
                            <Button size="small" color="success" variant="outlined" className={classes.addCancel} onClick={handleAddSectionMarker}>Add</Button>
                            <Button size="small" color="error" variant="text" className={classes.addCancel}
                                onClick={() => { setMarkerEntry({ type: "Section Marker", title: "" }); setShowAddMaker(false); }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                }
                {
                    showEditMarker &&
                    <div>
                        <div style={{ alignItems: 'center', display: 'flex', padding: '0 8px' }}>
                            <div className={classes.markerSelect}>
                                <p>Marker Title</p>
                            </div>
                            <div className={classes.markerTitle}>
                                <TextField
                                    InputProps={{ disableUnderline: true }}
                                    className={classes.textField}
                                    placeholder={'Enter Title'}
                                    variant="standard"
                                    style={{ width: "100%" }}
                                    value={editMarkerFields.title}
                                    name={"title"}
                                    onChange={(e) => { setEditMarkerFields({ ...editMarkerFields, ["title"]: e.target.value }) }}
                                />
                            </div>
                            <div className={classes.addCancel}>
                                <Button size="small" color="success" variant="outlined" className={classes.addCancel} onClick={handleUpdateSectionMarker}>{"update"}</Button>
                            </div>
                        </div>
                        <EditQuiz bookmark={editMarkerFields}/>
                    </div>
                }
            </div>


            {bookmarks?.length !== 0 && !showEditMarker && !showAddMaker && showBookmarks && <div className={classes.containerOuter} style={{ minWidth: '100%', padding: '0% 0%' }}>
                <div className={classes.containerInner}>
                    {bookmarks?.map((bookmark, index) => (
                        <div className={classes.tileStyle} key={index} title={bookmark.title}>
                            <Paper
                                onClick={() => {
                                    handleBookmarkClicked(bookmark);
                                }}
                                elevation={1}
                            >
                                <img crossOrigin="anonymous" src={bookmark.image} width='100%' />
                            </Paper>
                            <p style={{ color: 'blue' }}>
                                {bookmark.type === "Section Marker" ? "section" : "quiz"} : {bookmark.display}
                            </p>
                            <p style={{ textAlign: 'left' }} >
                                {/* <span style={{color:'blue'}}>{bookmark.display}</span>  */}
                                {bookmark.title.slice(0, 30)} {bookmark.title.length > 30 ? "..." : ""}
                            </p>
                        </div>
                    ))}
                </div>
            </div>}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

    </>)
}

export { InstructorVideoPlayer }