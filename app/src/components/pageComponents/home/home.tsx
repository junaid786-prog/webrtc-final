import React, { useState } from "react";
import { Button, CircularProgress } from "@material-ui/core";

import { analyticEvent } from "../../../utils/helper";
import "../../../css/main.css"

interface HomeProps {
    history: any
}
function Home(props: HomeProps) {
    const [loading, setLoading] = useState(false);
    const [quality, setQuality] = useState(12);
    const [classId, setClassId] = useState('')
    analyticEvent('vichat_home', 'Home page visited');
    const handleJoin = () => {
        if(classId){
            if (!loading) {
                setLoading(true);
                props.history?.push(`/join/${classId}?quality=${quality}`);
            }
        }
    }

    return (
        <React.Fragment>
            <div className="main-container-div">
                <div className="join-button-wrap">
                    <h3>Enter Class ID</h3>
                    <input value={classId} onChange={e => setClassId(e.target.value)} />
                    <Button className="join-button" variant="contained" disabled={loading} onClick={handleJoin}>
                        JOIN
                    </Button>
                    {loading && <CircularProgress className="btn-circular-loader" size={24} color="primary" />}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Home;