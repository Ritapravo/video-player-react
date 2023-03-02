import React from 'react';
import './../App.css';

const tileStyle= {
    width: '5vw',
    height: '5vw',
    border:'1px solid black', 
    display: 'inline-block', 
    margin: '1vw 0vw 1vw 1vw', 
    cursor: 'pointer',
    textAlign: 'center'
}

const TimestampTile = (props) => {
    const {title, timestamp} = props;
  return (
    <div className={'tileStyle'}>
        <h5>{title}</h5>
        <p>{timestamp}</p>
    </div>
  )
}

export default TimestampTile;