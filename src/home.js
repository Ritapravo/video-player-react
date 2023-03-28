import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const buttonStyle = {
    margin: '10px'
}

const Home = () => {
    const Navigate = useNavigate();
    return (
        <div style={{ display: 'flex', alignItems: 'center', height: '80vh', flexDirection: 'row', justifyContent: 'center' }}>
            <Button style={buttonStyle} variant="outlined" onClick={() => { Navigate('/instructor') }}>Instructor Video Player</Button>
            <Button style={buttonStyle} variant="text" onClick={() => { Navigate('/student') }}>Student Video Player</Button>
        </div>
    )
}

export default Home


