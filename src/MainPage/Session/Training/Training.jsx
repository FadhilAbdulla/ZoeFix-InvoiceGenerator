import React from 'react';
import { Link } from 'react-router-dom';


const Training = () => {
    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                    <h4>Training</h4>
                    </div>
                    <div className="page-btn">
                    <Link to="/dream-pos/dashboard" className="btn btn-added">
                        Navigate to dashboard
                    </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Training;
