import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProfileForm from "./components/ProfileForm";
import Profile from "./pages/Profile";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
	return (
		<Router>
			<div className="p-6">
				<nav className="flex space-x-4 mb-4">
					<Link to="/" className="text-blue-500">
						Home
					</Link>
					<Link to="/profile" className="text-blue-500">
						Profile
					</Link>
				</nav>

				<Routes>
					<Route
						path="/"
						element={
							<ErrorBoundary>
								<ProfileForm />
							</ErrorBoundary>
						}
					/>
					<Route
						path="/profile"
						element={
							<ErrorBoundary>
								<Profile />
							</ErrorBoundary>
						}
					/>
					<Route
						path="/edit-profile/:id"
						element={
							<ErrorBoundary>
								<ProfileForm />
							</ErrorBoundary>
						}
					/>
				</Routes>
			</div>
		</Router>
	);
}
