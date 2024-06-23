import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from "../config";

function ChangePassword ({onChangePwd, user}) {

    const [formData, setFormData] = useState({
        username: '',
        pwd: '',
        new_pwd: '',
        confirm_pwd: ''
    });
    const [userInfo, setUserInfo] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${config.userServiceUrl}/user/${user.id}/ChangePassword`, {
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
                        msg: user.username + ' password changed successfully.'
                    });
                    if (response_log.status === 200) {
                        console.log('Password change information saved successfully:', response_log.data);
                    } else {
                        console.error('Password change information failed to be saved:', response_log);
                    }
                } catch (error) {
                    console.error('There was an error while saving the password change information:', error);
                }

                navigate('/');
            }
        } catch (error) {
            try {
                const response_log = await axios.post(`${config.logServiceUrl}/log`, {
                    msg: user.username + ' password changed failed.'
                });
                if (response_log.status === 200) {
                    console.log('Password change information saved successfully:', response_log.data);
                } else {
                    console.error('Password change information failed to be saved:', response_log);
                }
            } catch (error) {
                console.error('There was an error while saving the password change information:', error);
            }
            console.error('There was an error during the login process:', error);
            alert('login failed')
        }
    };

    useEffect(() => {
        if (!user || !user.id) return;
        axios
          .post(`${config.userServiceUrl}/user/${user.id}/ChangePassword`)
          .then((response) => {
            if (response.data.success) {
              setUserInfo(response.data.data);
            }
          })
          .catch((error) => console.log(error));
      }, [user]);
    
      if (!userInfo) {
        return <div>Loading...</div>;
      } else {
        console.log(userInfo);
      }



    return (
        <>
            <div className='container pt-5'>
                <form onSubmit={handleSubmit}>
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