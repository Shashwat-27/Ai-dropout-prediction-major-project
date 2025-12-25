import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

function Signup() {
	const { login } = useAuth()
	const navigate = useNavigate()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const [role, setRole] = useState('Mentor')

	function handleSubmit(e) {
		e.preventDefault()
		if (password !== confirm) return
    login({ name, email, role })
    const pathByRole = { Mentor: '/mentor', College: '/college', Psychologist: '/psychologist',Student:'/student' }
    navigate(pathByRole[role] || '/')
	}

	return (
		<div className="centered">
			<form className="card form" onSubmit={handleSubmit}>
				<h2>Create your account</h2>
				<label>Name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
				<label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
				<label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
				<label>Confirm Password<input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required /></label>
				<label>Role
					<select value={role} onChange={(e) => setRole(e.target.value)}>
						<option>Mentor</option>
						<option>College</option>
						<option>Psychologist</option>
						<option>Student</option>
					</select>
				</label>
				<button className="btn" type="submit">Sign Up</button>
			</form>
		</div>
	)
}

export default Signup


