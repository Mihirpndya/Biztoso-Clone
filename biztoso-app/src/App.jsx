import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import supabase from "./utils/supabase";
import { useSelector } from "react-redux";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ProfileForm from "./components/ProfileForm";
import Chat from "./pages/Chat";
import Leads from "./pages/Leads";

export default function App() {
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true);

	// Get profile from Redux state
	const profile = useSelector((state) => state.profile.profiles[0]); // First profile

	useEffect(() => {
		const checkAuth = async () => {
			const { data, error } = await supabase.auth.getSession();
			if (error) {
				console.error("Error getting session:", error.message);
				setLoading(false);
				return;
			}
			setSession(data.session);
			setLoading(false);
		};

		checkAuth();

		// Listen for auth changes
		const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => authListener.subscription.unsubscribe();
	}, []);

	if (loading) return <p>Loading...</p>;

	return (
		<Router>
			<div className="p-6">
				<nav className="flex space-x-4 mb-4">
					{session ? (
						<>
							<Link to={profile ? "/profile" : "/create-profile"} className="text-blue-500">
								Profile
							</Link>
							<Link to="/chat" className="text-blue-500">Messages</Link>
							<Link to="/leads" className="text-blue-500">Leads</Link>
							<button
								onClick={async () => {
									await supabase.auth.signOut();
									setSession(null);
								}}
								className="text-red-500"
							>
								Logout
							</button>
						</>
					) : (
						<Link to="/" className="text-blue-500">Login</Link>
					)}
				</nav>

				<Routes>
					<Route path="/" element={session ? <Navigate to={profile ? "/profile" : "/create-profile"} /> : <Auth />} />
					<Route path="/profile" element={session ? (profile ? <Profile /> : <Navigate to="/create-profile" />) : <Navigate to="/" />} />
					<Route path="/create-profile" element={session ? (profile ? <Navigate to="/profile" /> : <ProfileForm />) : <Navigate to="/" />} />
					<Route path="/edit-profile/:id" element={session ? (profile ? <ProfileForm /> : <Navigate to="/create-profile" />) : <Navigate to="/" />} />
					<Route path="/chat" element={session ? <Chat /> : <Navigate to="/" />} />
					<Route path="/leads" element={session ? <Leads /> : <Navigate to="/" />} />
				</Routes>
			</div>
		</Router>
	);
}
