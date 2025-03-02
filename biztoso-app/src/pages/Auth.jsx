import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";

export default function Auth() {
	const [loading, setLoading] = useState(true);
	const [session, setSession] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = async () => {
			const { data, error } = await supabase.auth.getSession();
			if (error) {
				console.error("Error getting session:", error.message);
				setLoading(false);
				return;
			}

			if (data.session) {
				console.log("User authenticated:", data.session.user);
				setSession(data.session);
				navigate("/profile"); // Redirect only if session exists
			} else {
				console.log("No user session found. Staying on Auth.");
			}

			setLoading(false);
		};

		checkAuth();
	}, [navigate]);

	// Show loading state
	if (loading) return <p>Checking authentication...</p>;

	return (
		<div className="auth-container flex flex-col items-center justify-center h-screen">
			<h2 className="text-2xl font-bold mb-4">Login</h2>
			<button
				onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
				className="bg-blue-500 text-white py-2 px-6 rounded-md"
			>
				Sign in with Google
			</button>
		</div>
	);
}
