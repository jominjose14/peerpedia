import { useState, type FormEvent } from "react";
import { postLogin } from "../../lib/requests";
import { Link, useNavigate } from "react-router-dom";
import type { APIResponse } from "../../lib/types";
import Spinner from "../Spinner";
import Fullscreen from "../Fullscreen";
import Main from "../Main";
import Button from "../Button";

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
        <Fullscreen>
            <Main className="grid place-items-center p-0">
                <form className="flex flex-col gap-2 bg-white text-lg text-gray-700 rounded-sm shadow-[0_0_1.25rem_rgb(0,0,0,0.125)] p-12 w-13/16 sm:w-15/64" onSubmit={onFormSubmit}>
                    <div className="flex gap-4 items-center justify-center mb-6">
                        <img src="favicon.svg" alt="peerpedia icon" height="30px" width="30px" />
                        <h1 className="text-2xl">Login</h1>
                    </div>
                    <input type="text" name="username" id="login-username" spellCheck="false" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} className="border-[1px] border-gray-200 outline-blue-500 px-3 py-1.5" />
                    <input type="password" name="password" id="login-password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="border-[1px] border-gray-200 outline-blue-500 px-3 py-1.5" />
                    {loginError && <p className="px-2 text-sm text-red-500 text-center">{loginError}</p>}
                    <Button type="submit" disabled={loading} className="w-3/4 mx-auto font-normal mt-2 px-2 py-2.25">Login</Button>
                    <p className="mt-4 text-[1.1rem]/[1.3] px-2 text-center">Don't have an account? <Link to="/signup" className="text-blue-500">Signup</Link></p>
                </form>
            </Main>
            <Spinner loading={loading} />
        </Fullscreen>
    )
}

export default Login;