import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
	const profiles = useSelector((state) => state.profile.profiles);

	if (!profiles.length) {
		return (
			<p className="text-center text-gray-500">No profiles created yet.</p>
		);
	}

	return (
		<div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
			<h2 className="text-2xl font-bold mb-4">Business Profiles</h2>

			{profiles.map((profile) => (
				<div key={profile.id} className="mb-6 p-4 border rounded-lg">
					{/* ✅ Business Logo Section Restored */}
					<div className="flex justify-center mb-4">
						{profile.logo ? (
							<img
								src={profile.logo}
								alt="Business Logo"
								className="w-32 h-32 rounded-md object-cover"
							/>
						) : (
							<div className="w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center">
								<span className="text-gray-500 text-sm">No Logo</span>
							</div>
						)}
					</div>

					{/* Business Info */}
					<p>
						<strong>Name:</strong> {profile.name}
					</p>
					<p>
						<strong>Location:</strong> {profile.location}
					</p>
					<p>
						<strong>Description:</strong> {profile.description}
					</p>

					{/* ✅ Edit Profile Button */}
					<Link to={`/edit-profile/${profile.id}`} className="text-blue-500">
						Edit
					</Link>
				</div>
			))}
		</div>
	);
}
