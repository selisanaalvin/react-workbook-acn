import React, { useState, useEffect } from 'react'
import { Button, Card, CardActions, CardContent, TextField, Grid } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import WorkBooklist from './WorkBooklist'
import axios from 'axios'

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
  } from '@material-ui/pickers';

export default function WorkBook() {
    const dbid = '60c2ec99a8bf076b5f64d110'; //id for JSONbin
    const config = {
        headers:{
            'Content-Type':'application/json',
            'X-Master-Key':'$2b$10$CyqZFDnNsaXSs6EKER7s1Ob3lE31lU3BLeA2wVXDfWEm6lNeS6IX.' //master key in JSONbin
        }
    }
    const today = new Date();
    const [users, setUserList] = useState([]);
    const [newuser, setUsers] = useState({
        firstName: '',
        lastName: '',
        email:'',
        enterpriseID:'',
        birthday: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
    });
    const [isvalidate, setValidation] = useState(false)
    const [isemailvalid, setEmailValid] = useState(true)

    useEffect(() => {
        console.warn(`https://api.jsonbin.io/v3/b/${dbid}/latest`)
      axios.get(`https://api.jsonbin.io/v3/b/${dbid}/latest`, config)
      .then(res => {
          setUserList(res.data.record)
      })
    },[])

    const deleteList = (id) => {
        let updatedlist = users.filter(user => user.enterpriseID !== id);
        axios.put(`https://api.jsonbin.io/v3/b/${dbid}`,
        updatedlist, config)
            .then(res => {
                console.log('success')
                setUserList(updatedlist)
                console.warn('Deleted Successfully!')

            })
            .catch(err => {
                console.error(err)
            })
    }

    const handleDateChange = (date) => {
        setUsers({
            ...newuser,
            birthday: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
        })
        console.warn(newuser);
    }

    const validateNumberOnly = (e) => {
        const rex = /^[0-9]+$/;
        if (e.target.value === "" || rex.test(e.target.value)) {
            setUsers({...newuser, enterpriseID: e.target.value});
        }
    }

    const validateLetterOnly = (e) => {
        const rex = /^[a-zA-Z]+$/;
       
        if (e.target.value === "" || rex.test(e.target.value)) {
            switch(e.target.id) {
                case 'firstname':
                    setUsers({...newuser, firstName: e.target.value});
                    break;
                case 'lastname':
                    setUsers({...newuser, lastName: e.target.value});
                    break;
                default:
                    break;
            }
        }
    }

    const validateEmail = (e) => {
        const rex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        setUsers({...newuser, email: e.target.value});

        if (rex.test(e.target.value)) {
            setEmailValid(true)
        } else {
            setEmailValid(false)
        }
    }

    const submitUser = () => {
        const newData = [...users, newuser]
        setValidation(true)
        if (newuser.firstName !== '' && newuser.lastName !== '' && newuser.email !== '' && isemailvalid === true && newuser.enterpriseID !== '') {
            axios.put(`https://api.jsonbin.io/v3/b/${dbid}`,
            newData, config)
            .then(res => {
                console.log('success')
                setUserList(newData);
                alert('Data Save Successfully!')

            })
            .catch(err => {
                console.error(err)
            })
        }
    }
    return (
        <div>
                <Card>
                    <CardContent>
                            <Grid container spacing={3}>
                            <Grid item md={6} lg={6}>
                                <TextField error={newuser.firstName === '' && isvalidate? true : false} helperText={newuser.firstName === '' && isvalidate? 'Please enter your firstname' : null} id="firstname" label="First Name" value={newuser.firstName} onChange={validateLetterOnly} variant="outlined"/>
                            </Grid>
                            <Grid item md={6} lg={6}>
                                <TextField error={newuser.lastName === '' && isvalidate? true : false} helperText={newuser.lastName === '' && isvalidate? 'Please enter your lastname' : null} id="lastname" label="Last Name" value={newuser.lastName} onChange={validateLetterOnly} variant="outlined"/>
                            </Grid>    
                            <Grid item md={6} lg={6}>
                                <TextField error={newuser.email === '' && isvalidate? true :  isemailvalid === false && isvalidate ? true : false} helperText={newuser.email === '' && isvalidate? 'Please enter your email' :  isemailvalid === false && isvalidate ? 'Invalid Email format' : null} id="email" label="Email" value={newuser.email} onChange={validateEmail} variant="outlined"/>
                            </Grid>
                            <Grid item md={6} lg={6}>
                                <TextField error={newuser.enterpriseID === '' && isvalidate? true : false} helperText={newuser.enterpriseID === '' && isvalidate? 'Please enter your enterprise ID' : null} id="enterpriseid" label="Enterprise ID" value={newuser.enterpriseID} onChange={validateNumberOnly} variant="outlined"/>
                            </Grid>
                            <Grid item md={6} lg={12}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        id="date-picker-dialog"
                                        label="Birthday"
                                        format="MM/dd/yyyy"
                                        value={newuser.birthday}
                                        onChange={handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                            </Grid>
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" color="primary" onClick={submitUser}>
                            Submit
                        </Button>
                    </CardActions>
                </Card>
                <WorkBooklist list={users} handleDelete={deleteList}/>
        </div>
    )
}
