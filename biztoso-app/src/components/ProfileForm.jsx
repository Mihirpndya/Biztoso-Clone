import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addProfile, editProfile } from "../features/profileSlice";
import supabase from "../utils/supabase.js";
import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react"; // ✅ Import Cross Icon

// ✅ Validation Schema
const validationSchema = Yup.object().shape({
	name: Yup.string().required("Business name is required"),
	location: Yup.string().required("Location is required"),
	description: Yup.string().required("Description is required"),
	logo: Yup.mixed()
		.test("fileSize", "File must be less than 1MB", (value) =>
			value ? value.size <= 1000000 : true
		)
		.test("fileType", "Only PNG files are allowed", (value) =>
			value ? value.type === "image/png" : true
		),
});

export default function ProfileForm() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();
	const profiles = useSelector((state) => state.profile.profiles);

	const editingProfile = profiles.find((p) => p.id === Number(id)) || null;

	const [preview, setPreview] = useState(editingProfile?.logo || "");
	const [uploading, setUploading] = useState(false);

	const handleImageChange = async (event, setFieldValue) => {
		const file = event.currentTarget.files[0];
		if (!file) return;

		if (file.type !== "image/png") {
			alert("Only PNG files are allowed.");
			return;
		}
		if (file.size > 1000000) {
			alert("File must be less than 1MB.");
			return;
		}

		setUploading(true);
		const fileName = `${Date.now()}-${file.name}`;

		const { data, error } = await supabase.storage
			.from("logos")
			.upload(fileName, file);
		setUploading(false);

		if (error) {
			console.error("Error uploading image:", error.message);
			alert("Failed to upload image.");
			return;
		}

		const { data: urlData } = supabase.storage
			.from("logos")
			.getPublicUrl(fileName);
		const publicUrl = urlData.publicUrl;

		if (!publicUrl) {
			alert("Image uploaded but URL not found.");
			return;
		}

		setPreview(publicUrl);
		setFieldValue("logo", file);
	};

	return (
		<div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg relative">
			{/* ✅ Cross (X) Button on the Top-Right (Only in Edit Mode) */}
			{editingProfile && (
				<button
					onClick={() => navigate("/profile")}
					className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
				>
					<X size={24} />
				</button>
			)}

			<h2 className="text-2xl font-bold mb-4 text-center">
				{editingProfile ? "Edit Business Profile" : "Create Business Profile"}
			</h2>

			<Formik
				initialValues={{
					name: editingProfile?.name || "",
					location: editingProfile?.location || "",
					description: editingProfile?.description || "",
					logo: editingProfile?.logo || null,
				}}
				validationSchema={validationSchema}
				onSubmit={(values) => {
					if (editingProfile) {
						dispatch(
							editProfile({ ...values, id: editingProfile.id, logo: preview })
						);
					} else {
						dispatch(addProfile({ ...values, logo: preview }));
					}
					navigate("/profile");
				}}
			>
				{({ setFieldValue }) => (
					<Form className="space-y-4">
						<div>
							<label className="block font-medium">Business Name</label>
							<Field name="name" className="border p-2 w-full rounded-md" />
							<ErrorMessage
								name="name"
								component="p"
								className="text-red-500 text-sm"
							/>
						</div>

						<div>
							<label className="block font-medium">Location</label>
							<Field name="location" className="border p-2 w-full rounded-md" />
							<ErrorMessage
								name="location"
								component="p"
								className="text-red-500 text-sm"
							/>
						</div>

						<div>
							<label className="block font-medium">Description</label>
							<Field
								as="textarea"
								name="description"
								className="border p-2 w-full rounded-md"
							/>
							<ErrorMessage
								name="description"
								component="p"
								className="text-red-500 text-sm"
							/>
						</div>

						{/* ✅ Upload Logo */}
						<div>
							<label className="block font-medium">Upload Logo</label>
							<input
								type="file"
								accept="image/png"
								onChange={(event) => handleImageChange(event, setFieldValue)}
								className="border p-2 w-full rounded-md"
							/>
							{uploading && <p className="text-blue-500">Uploading...</p>}
							<ErrorMessage
								name="logo"
								component="p"
								className="text-red-500 text-sm"
							/>
							{preview && (
								<img
									src={preview}
									alt="Preview"
									className="mt-2 w-32 h-32 object-cover rounded-md"
								/>
							)}
						</div>

						{/* ✅ Save/Update Button Centered */}
						<div className="flex justify-center">
							<button
								type="submit"
								className="bg-blue-500 text-white py-2 px-6 rounded-md"
							>
								{editingProfile ? "Update Profile" : "Save Profile"}
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
}
