import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from "../config";

function ChangePassword ({onChangePwd}) {

    const [formData, setFormData] = useState({
        username: '',
        pwd: '',
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
            const response = await axios.post(`${config.userServiceUrl}/ChangePassword`, {
                username: formData.username,
                pwd: formData.pwd,
                new_pwd: formData.new_pwd,
                confirm_pwd: formData.confirm_pwd       
            });

            if (response.status === 200) {
                console.log('Password Changed:', response.data);
                onChangePwd(response.data);

                try {
                    const response_log = await axios.post(`${config.logServiceUrl}/log`, {
                        msg: formData.username += ' login successfully.'
                    });
                    if (response_log.status === 200) {
                        console.log('Login information saved successfully:', response_log.data);
                    } else {
                        console.error('Login information failed to be saved:', response_log);
                    }
                } catch (error) {
                    console.error('There was an error while saving the login information:', error);
                }

                navigate('/');
            } else {
                console.error('Login failed:', response);
                alert('login failed')
            }
        } catch (error) {
            console.error('There was an error during the login process:', error);
            alert('login failed')
        }
    };



    return (
        <>
            <div className='container pt-5'>
                <form onSubmit={handleSubmit}>
                    <div className='row mt-5'>
                        <div className="col-4">
                            <label htmlFor='username' className="form-label">Username</label>
                            <input type='text' className="form-control" name='username' value={formData.username} disabled/>
                        </div>
                    </div>
                    <div className='row mt-4'>
                        <div className="col-4">
                            <label htmlFor='pwd' className="form-label">Old Password</label>
                            <input type='password' className="form-control" name='pwd' 
                                value={formData.pws} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className='row mt-4'>
                        <div className="col-4">
                            <label htmlFor='new_pwd' className="form-label">New Password</label>
                            <input type='password' className="form-control" name='new_pwd' 
                                value={formData.new_pwd} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className='row mt-4'>
                        <div className="col-4">
                            <label htmlFor='confirm_pws' className="form-label">Confirm Password</label>
                            <input type='password' className="form-control" name='confirm_pwd' 
                                value={formData.confirm_pwd} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className='row my-4'>
                        <div className="col-4">
                            <button type="submit" className="btn btn-danger">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default ChangePassword;