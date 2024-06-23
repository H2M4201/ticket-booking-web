import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from "../config";

function ResetPassword({ onReset }) {
    const [formData, setFormData] = useState({
        username: '',
        new_pwd: '',
        confirm_pwd: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${config.userServiceUrl}/ResetPassword`, {
                username: formData.username,
                new_pwd: formData.new_pwd,
                confirm_pwd: formData.confirm_pwd
            });

            if (response.status === 200) {
                console.log('Password reset successfully!!:', response.data);
                onReset(response.data);

                try {
                    const response_log = await axios.post(`${config.logServiceUrl}/log`, {
                        msg: formData.username += ' password reset successfully.'
                    });
                    if (response_log.status === 200) {
                        console.log('Password reset information saved successfully:', response_log.data);
                    } else {
                        console.error('Password reset information failed to be saved:', response_log);
                    }
                } catch (error) {
                    console.error('There was an error while saving the password reset information:', error);
                }

                navigate('/');
            } else {
                console.error('Password reset failed:', response);
                alert('Password reset failed')
            }
        } catch (error) {
            console.error('There was an error during the password reset process:', error);
            alert('Password reset failed')
        }
    };

    return (
        <>
            <div className='container pt-5'>
                <div className="row mt-2">
                    <div className="col">
                        <h2>Reset Password</h2>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='row mt-5'>
                        <div className="col-4">
                            <label htmlFor='username' className="form-label">Username</label>
                            <input type='text' className="form-control" name='username' value={formData.username} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className='row mt-4'>
                        <div className="col-4">
                            <label htmlFor='new_pwd' className="form-label">New Password</label>
                            <input type='password' className="form-control" name='new_pwd' value={formData.new_pwd} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className='row mt-4'>
                        <div className="col-4">
                            <label htmlFor='confirm_pwd' className="form-label">Confirm Password</label>
                            <input type='password' className="form-control" name='confirm_pwd' value={formData.confirm_pwd} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className='row my-4'>
                        <div className="col-4">
                            <button type="submit" className="btn btn-danger">Reset Password</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default ResetPassword;
