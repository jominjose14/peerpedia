import { useState, type FormEvent } from "react";
import { postLogin } from "../../lib/requests";
import { Link, useNavigate } from "react-router-dom";
import type { APIResponse } from "../../lib/types";
import Spinner from "../Spinner";

function Login() {
    const [loading, setLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loginError, setLoginError] = useState<string>('');
    const navigate = useNavigate();

    async function onFormSubmit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        setLoginError('');

        if (username === '' || password === '') {
            setLoginError('Username or password is empty');
            setLoading(false);
            return;
        }

        const response: APIResponse = await postLogin(username, password);
        if (response.success) {
            setLoading(false);
            navigate("/");
        } else {
            setLoginError(response.message);
            setLoading(false);
        }
    }

    return (
        <div className="h-screen w-full grid place-items-center animate-fade bg-gradient-to-r from-blue-50 via-white to-blue-50">
            <form className="flex flex-col gap-2 rounded-sm shadow-[0_0_1.25rem_rgb(0,0,0,0.125)] p-12 max-w-15/16 bg-white" onSubmit={onFormSubmit}>
                <div className="flex gap-4 items-center justify-center mb-6">
                    <img src="favicon.svg" alt="peerpedia icon" height="30px" width="30px" />
                    <h1 className="text-xl">Login</h1>
                </div>
                <input type="text" name="username" id="login-username" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} className="border-[1px] border-gray-200 outline-blue-500 px-3 py-1.5" />
                <input type="password" name="password" id="login-password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="border-[1px] border-gray-200 outline-blue-500 px-3 py-1.5" />
                {loginError && <p className="px-2 text-sm text-red-500 text-center">{loginError}</p>}
                <button type="submit" disabled={loading} className="w-3/4 font-semi-bold mt-2 self-center cursor-pointer px-2 py-2.5 bg-blue-500 hover:bg-blue-400 transition text-blue-50 rounded-4xl">Login</button>
                <p className="mt-4">Don't have an account? <Link to="/signup" className="text-blue-500">Signup</Link></p>
            </form>
            <Spinner loading={loading} />
        </div>
    )
}

export default Login;