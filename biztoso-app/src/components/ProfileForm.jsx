import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addProfile } from "../features/profileSlice";
import supabase from "../utils/supabase.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ✅ Define Validation Schema
const schema = z.object({
	name: z.string().min(1, "Business name is required"),
	location: z.string().min(1, "Location is required"),
	description: z.string().min(1, "Description is required"),
	logo: z
		.instanceof(File, { message: "File is required" }) // ✅ Ensure it's a file
		.refine((file) => file.size <= 1000000, "File must be less than 1MB") // ✅ 1MB limit
		.refine((file) => file.type === "image/png", "Only PNG files are allowed"), // ✅ PNG only
});

export default function ProfileForm() {
	const dispatch = useDispatch();
	const profiles = useSelector((state) => state.profile.profiles);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema), // ✅ Apply validation
		defaultValues: { name: "", location: "", description: "", logo: "" },
	});

	const [preview, setPreview] = useState("");
	const [uploading, setUploading] = useState(false);

	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// ✅ Validate File Type & Size
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

		// ✅ Upload to Supabase Storage
		const { data, error } = await supabase.storage
			.from("logos")
			.upload(fileName, file);
		setUploading(false);

		if (error) {
			console.error("Error uploading image:", error.message);
			alert("Failed to upload image.");
			return;
		}

		// ✅ Retrieve Public URL
		const { data: urlData } = supabase.storage
			.from("logos")
			.getPublicUrl(fileName);
		const publicUrl = urlData.publicUrl;

		if (!publicUrl) {
			alert("Image uploaded but URL not found.");
			return;
		}

		setPreview(publicUrl);
		setValue("logo", file, { shouldValidate: true }); // ✅ Store file for validation
	};

	const onSubmit = (data) => {
		dispatch(addProfile({ ...data, logo: preview })); // ✅ Store in Redux
	};

	return (
		<div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
			<h2 className="text-2xl font-bold mb-4">Create Business Profile</h2>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<label className="block font-medium">Business Name</label>
					<input
						{...register("name")}
						className="border p-2 w-full rounded-md"
					/>
					<p className="text-red-500 text-sm">{errors.name?.message}</p>
				</div>

				<div>
					<label className="block font-medium">Location</label>
					<input
						{...register("location")}
						className="border p-2 w-full rounded-md"
					/>
					<p className="text-red-500 text-sm">{errors.location?.message}</p>
				</div>

				<div>
					<label className="block font-medium">Description</label>
					<textarea
						{...register("description")}
						className="border p-2 w-full rounded-md"
					/>
					<p className="text-red-500 text-sm">{errors.description?.message}</p>
				</div>

				{/* ✅ Upload Logo */}
				<div>
					<label className="block font-medium">Upload Logo</label>
					<input
						type="file"
						accept="image/png"
						onChange={handleImageChange}
						className="border p-2 w-full rounded-md"
					/>
					{uploading && <p className="text-blue-500">Uploading...</p>}
					{errors.logo && (
						<p className="text-red-500 text-sm">{errors.logo.message}</p>
					)}{" "}
					{/* ✅ Show validation error */}
					{preview && (
						<img
							src={preview}
							alt="Preview"
							className="mt-2 w-32 h-32 object-cover rounded-md"
						/>
					)}
				</div>

				<button
					type="submit"
					className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md"
				>
					Save Profile
				</button>
			</form>
		</div>
	);
}
