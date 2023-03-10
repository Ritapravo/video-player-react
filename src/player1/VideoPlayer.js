import React from 'react';
import ReactPlayer from 'react-player'
import TimestampTile from '../components/timestampTile';
import '../App.css'



const timestamps = [
    { id: '1', title: 'Point 1', timestamp: '0:30', },
    { id: '2', title: 'Point 2', timestamp: '1:00', },
    { id: '3', title: 'Point 3', timestamp: '1:30', },
    { id: '4', title: 'Point 4', timestamp: '2:00', },
    { id: '5', title: 'Point 5', timestamp: '0:30', },
    { id: '6', title: 'Point 6', timestamp: '0:30', },
    { id: '7', title: 'Point 7', timestamp: '0:30', },
    { id: '8', title: 'Point 8', timestamp: '0:30', },
    { id: '9', title: 'Point 9', timestamp: '0:30', },
    { id: '9', title: 'Point 10', timestamp: '0:30', },
    { id: '9', title: 'Point 11', timestamp: '0:30', },
    { id: '9', title: 'Point 12', timestamp: '0:30', },
    { id: '9', title: 'Point 13', timestamp: '0:30', },
    { id: '9', title: 'Point 14', timestamp: '0:30', },
    { id: '9', title: 'Point 15', timestamp: '0:30', },
    { id: '9', title: 'Point 16', timestamp: '0:30', },
]

export const VideoPlayer = () => {
    return (
        <div style={{padding: '3vw 20vw',minHeight: '100vh'}}>


            <div className='outline'>
                <h2 style={{ textDecoration: 'underline' }}>This is Title</h2>
                <h4>Description</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in v
                    oluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                    proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                </p>

                <hr />
                <ReactPlayer
                    width={'100%'}
                    height={'100%'}
                    url='videos/video.mp4'
                    playing={true}
                    controls={true}
                    pip
                    playIcon
                    volume={1}
                    stopOnUnmount
                    muted={false}
                />
                <hr />

                <div className='containerOuter' style={{ minWidth: '100%', border: '1px solid black', padding: '0% 0%' }}>

                    <div className='containerInner'>
                        {
                            timestamps.map((item, index) => (
                                <TimestampTile title={item.title} timestamp={item.timestamp} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
