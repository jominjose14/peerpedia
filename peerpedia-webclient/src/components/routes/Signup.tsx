import { useState, type FormEvent } from "react";
import { postSignup } from "../../lib/requests";
import { Link, useNavigate } from "react-router-dom";
import type { APIResponse } from "../../lib/types";
import Spinner from "../Spinner";

function Signup() {
    const [loading, setLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [signupError, setSignupError] = useState<string>('');
    const navigate = useNavigate();

    async function onFormSubmit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        setSignupError('');

        if (username === '' || password === '' || confirmPassword === '') {
            setSignupError('All fields must be filled');
            setLoading(false);
            return;
        } else if (password !== confirmPassword) {
            setSignupError('Password and Confirm Password must match');
            setLoading(false);
            return;
        } else if (password.length < 4 || 16 < password.length) {
            setSignupError('Password must be between 4 and 16 characters long');
            setLoading(false);
            return;
        }

        const response: APIResponse = await postSignup(username, password);
        if (response.success) {
            setLoading(false);
            navigate("/login");
        } else {
            setSignupError(response.message);
            setLoading(false);
        }
    }

    return (
        <div className="h-screen w-full grid place-items-center animate-fade bg-gradient-to-r from-blue-50 via-white to-blue-50">
            <form className="flex flex-col gap-2 rounded-sm bg-white shadow-[0_0_1.25rem_rgb(0,0,0,0.125)] p-12 max-w-15/16" onSubmit={onFormSubmit}>
                <div className="flex gap-4 items-center justify-center mb-6">
                    <img src="favicon.svg" alt="peerpedia icon" height="30px" width="30px" />
                    <h1 className="text-xl">Signup</h1>
                </div>
                <input type="text" name="username" id="signup-username" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} className="border-[1px] border-gray-200 outline-blue-500 px-3 py-1.5" />
                <input type="password" name="password" id="signup-password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="border-[1px] border-gray-200 outline-blue-500 px-3 py-1.5" />
                <input type="password" name="confirm-password" id="signup-confirm-password" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border-[1px] border-gray-200 outline-blue-500 px-3 py-1.5" />
                {signupError && <p className="text-sm text-red-500 text-center">{signupError}</p>}
                <button type="submit" disabled={loading} className="w-3/4 font-semi-bold mt-2 self-center cursor-pointer px-2 py-2.5 bg-blue-500 hover:bg-blue-400 transition text-blue-50 rounded-4xl">Signup</button>
                <p className="mt-4">Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
            </form>
            <Spinner loading={loading} />
        </div>
    )
}

export default Signup;