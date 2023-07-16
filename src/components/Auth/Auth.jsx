import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'
import { InputContainer } from '../InputContainer/InputContainer'
import { BiArrowBack } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, updateUserDatabase } from '../Firebase/firebase'
import { toast } from 'react-toastify';

export const Auth = (props) => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
    })
    const navigate = useNavigate();
    const [errMsg, setErrMsg] = useState("");
    const [disableBtn, setDisableBtn] = useState(false);

    const handleLogin = () => {
        if (!values.email || !values.password) {
            setErrMsg("All Fields are required")
            setDisableBtn(false);
            return;
        }
        signInWithEmailAndPassword(auth, values.email, values.password).then(() => {
            toast.success("Successfully logged in");
            navigate('/');
        }).catch(err => {
            setErrMsg(err.message)
            setDisableBtn(false);
        })
    }

    const handleSignUp = async () => {
        if (!values.name || !values.email || !values.password) {
            setErrMsg("All Fields are required");
            setDisableBtn(false);
            return;
        }
        setErrMsg("");
        try {
            const response = await createUserWithEmailAndPassword(auth, values.email, values.password)
            toast.success("User created successfully");
            console.log(response);
            const uid = response.user.uid;
            const updateResponse = await updateUserDatabase(values, uid);
            console.log(updateResponse);
            navigate('/login');
            setDisableBtn(false);
        } catch (err) {
            // console.log(err.message);
            setErrMsg(err.message);
            setDisableBtn(false);
        }
    };

    const handleSubmission = (e) => {
        setDisableBtn(true);
        e.preventDefault();
        if (props.isSignup) handleSignUp();
        else handleLogin();
    }

    useEffect(() => {
        setErrMsg("");
    }, [])

    return (
        <div className='Auth'>
            <h6 onClick={() => navigate('/')}><BiArrowBack size={21} /> Back To Home </h6>
            <div className="form-container">
                <form onSubmit={handleSubmission}>
                    <h1>{props.isSignup ? 'SignUp' : 'Login'}</h1>
                    {props.isSignup && <InputContainer onChange={(e) => setValues({ ...values, name: e.target.value })} label='Name' placeholder="Enter Your Name" type="text" />}
                    <InputContainer onChange={(e) => setValues({ ...values, email: e.target.value })} label='Email' placeholder="Enter Your Email" type="email" />
                    <InputContainer onChange={(e) => setValues({ ...values, password: e.target.value })} label='Password' placeholder="Enter Your Password" password />
                    <p>{errMsg}</p>
                    <button disabled={disableBtn} type='submit'>{props.isSignup ? 'SignUp' : 'Login'}</button>
                </form>
                {props.isSignup ?
                    <p>Already Have An Account ? <Link className='link' to={'/login'}>Login Here</Link></p>
                    :
                    <p>New Here ? <Link className='link' to={'/signup'}>Create An Account</Link> </p>
                }
            </div>
        </div>
    )
}

export default Auth;