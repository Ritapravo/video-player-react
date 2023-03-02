import React from 'react';
import ReactPlayer from 'react-player'
import TimestampTile from '../components/timestampTile';
import { VideoPlayer2 } from './player2';
import styles from './player.module.css'
import { timestamps } from './dummy';

export const VideoPlayerContainer = () => {
    return (
        <div className={styles.container}>


            <div className={styles.outline}>
                <h2 style={{ textDecoration: 'underline' }}>This is Title</h2>
                <h4>Description</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in v
                    oluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                    proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                </p>

                
                <VideoPlayer2/>
                

                {/* <div className={styles.containerOuter} style={{ minWidth: '100%',  padding: '0% 0%' }}>

                    <div className={styles.containerInner}>
                        {
                            timestamps.map((item, index) => (
                                <TimestampTile title={item.title} timestamp={item.timestamp} />
                            ))
                        }
                    </div>
                </div> */}
            </div>
        </div>
    )
}
