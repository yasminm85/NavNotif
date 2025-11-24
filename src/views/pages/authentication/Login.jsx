import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginUser, reset } from '../../../features/authSlice';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';

import Logo from 'ui-component/Logo';

// ================================|| AUTH3 - LOGIN ||================================ //


export default function Login() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const [email, setEmail] = useState("");
    const [password,  setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user, isError, isSuccess, isLoading, message} = useSelector(
      (state) => state.auth
    );

    useEffect(() => {
      if (user || isSuccess) {
        navigate("/dashboard");
      }
      dispatch(reset());
    }, [user, isSuccess, dispatch, navigate]);

  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password }));
  };

  return (
    <AuthWrapper1>
      <Grid container direction="column" sx={{ justifyContent: 'flex-end', minHeight: '100vh' }}>
        <Grid size={12}>
          <Grid container sx={{ justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 68px)' }}>
            <Grid sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Grid container alignItems="center" spacing={1}>
                    {/* Logo */}
                    <Grid item>
                      <Logo />
                    </Grid>
                    {/* Text */}
                    <Grid item>
                    <Typography gutterBottom variant={downMD ? 'h3' : 'h2'}>NavNotif</Typography>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    <Grid container direction={{ xs: 'column-reverse', md: 'row' }} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Grid>
                        <Stack spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                          <Typography gutterBottom variant={downMD ? 'h3' : 'h2'} sx={{ color: 'primary.800' }}>
                            Hi, Welcome Back!
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    <AuthLogin />
                  </Grid>
                  <Grid size={12}>
                    <Divider />
                  </Grid>
                  <Grid size={12}>
                    <Grid container direction="column" sx={{ alignItems: 'center' }} size={12}>
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ px: 3, my: 3 }} size={12}>
          {/* <AuthFooter /> */}
        </Grid>
      </Grid>
      
      <section className="hero has-background-grey-light is-fullheight is-fullwidth">
        <div className="hero-body">
          <div className="container">
          <div className="columns is-centered">
              <div className="column is-4">
                  <form onSubmit={Auth} className='box'>
                    { isError && <p className='has-text-centered has-text-danger'>{message}</p>}
                  <h1 className='title is-2'>Login</h1>
                      <div className="field">
                          <label className="label">Email</label>
                          <div className="control">
                              <input 
                              type="text" 
                              className='input' 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder='Email' 
                              />
                          </div>
                      </div>

                      <div className="field">
                          <label className="label">Password</label>
                          <div className="control">
                              <input 
                              type="password" 
                              className='input' 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder='********' />
                          </div>
                      </div>
                      <p>Belum punya akun? <a href="/register">buat di sini</a></p>
                      <div className="field mt-5">
                              <button type='submit' className='button is-success is-fullwidth'>{isLoading ? "Loading..." : "Login"}</button>
                      </div>

                  </form>
              </div>
          </div>
          </div>
        </div>
      </section>
    
    </AuthWrapper1>
  );
  
}
