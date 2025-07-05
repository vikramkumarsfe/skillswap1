import { useState, useEffect, useRef } from "react";
import { auth, rtdb } from "../../utils/firabase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import Layoutuser from "./Layout";

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState("/images/image.jpg");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    address: "",
    mobile: "",
    email: "",
    skillsOffer: [],
    skillsWant: [],
    offerInput: "",
    wantInput: "",
  });

  // 🔐 Load user & profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        setFormData((prev) => ({ ...prev, email: u.email }));
        const userRef = ref(rtdb, `users/${u.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setFormData({
            name: data.displayName || "",
            bio: data.bio || "",
            address: data.address || "",
            mobile: data.mobile || "",
            email: u.email || "",
            skillsOffer: data.skillsOffered || [],
            skillsWant: data.skillsWanted || [],
            offerInput: "",
            wantInput: "",
          });
          if (data.photoURL) setProfilePic(data.photoURL);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 📤 Save to RTDB
  const handleSave = async () => {
    if (!user) return alert("Not logged in");

    const userRef = ref(rtdb, `users/${user.uid}`);
    await set(userRef, {
      displayName: formData.name,
      bio: formData.bio,
      address: formData.address,
      mobile: formData.mobile,
      photoURL: profilePic,
      email: formData.email,
      skillsOffered: formData.skillsOffer,
      skillsWanted: formData.skillsWant,
    });

    alert("Profile saved to database!");
  };

  // 📸 Profile Image Change
  const handleImageClick = () => fileInputRef.current.click();

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "skillswap"); // ⬅️ Replace
    formData.append("cloud_name", "dqr8lpr0d");       // ⬅️ Replace

    try {
        console.log('trying toupload ')
        const res = await fetch("https://api.cloudinary.com/v1_1/dqr8lpr0d/image/upload", {
        method: "POST",
        body: formData,
        });
        const data = await res.json();
        return data.secure_url; // 🔗 Return image URL
    } catch (err) {
        console.error("Upload error:", err);
        return null;
    }
    };


    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const user = auth.currentUser; // ✅ current user object
        if (!user) {
            alert("User not logged in.");
            return;
        }

        const imageUrl = await uploadImageToCloudinary(file);

        if (imageUrl) {
            await set(ref(rtdb, `users/${user.uid}/photoURL`), imageUrl);
            alert("Profile image updated!");
        } else {
            alert("Failed to upload image.");
        }
    };


  // 📝 Text Fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ➕ Skill Adders
  const addSkill = (type) => {
    const key = type === "offerInput" ? "skillsOffer" : "skillsWant";
    const value = formData[type].trim();
    if (value && !formData[key].includes(value)) {
      setFormData((prev) => ({
        ...prev,
        [key]: [...prev[key], value],
        [type]: "",
      }));
    }
  };

  // ❌ Cancel Logic
  const handleCancel = () => {
    window.history.back(); // or navigate("/profile")
  };

  const removeSkill = (type, index) => {
    const key = type === "offer" ? "skillsOffer" : "skillsWant";
    setFormData((prev) => ({
        ...prev,
        [key]: prev[key].filter((_, i) => i !== index),
    }));
    };


  return (
    <Layoutuser>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-24 h-24 rounded-full overflow-hidden border-4 border-cyan-500 cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              src={profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <p className="text-sm text-gray-500 mt-2">Click to update photo</p>
        </div>

        {/* Main Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="border p-2 rounded w-full"
          />
          <input
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile No"
            className="border p-2 rounded w-full"
          />
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="border p-2 rounded w-full"
          />
          <input
            name="email"
            value={formData.email}
            disabled
            className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
          />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Short Bio"
            className="border p-2 rounded w-full col-span-1 md:col-span-2"
          />
        </div>

        {/* Skills Offer */}
        <div className="mt-6">
          <label className="font-semibold">Skills I Offer</label>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              name="offerInput"
              value={formData.offerInput}
              onChange={handleChange}
              placeholder="Add skill"
              className="border p-2 rounded w-full"
            />
            <button
              className="bg-cyan-500 text-white px-4 rounded"
              onClick={() => addSkill("offerInput")}
              type="button"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skillsOffer.map((skill, idx) => (
                <span
                    key={idx}
                    className="px-3 py-1 bg-cyan-100 rounded-full text-sm flex items-center gap-1"
                >
                    {skill}
                    <button
                    type="button"
                    className="text-red-600 ml-1"
                    onClick={() => removeSkill("offer", idx)}
                    >
                    <i className="ri-close-line"></i>
                    </button>
                </span>
                ))}

          </div>
        </div>

        {/* Skills Want */}
        <div className="mt-6">
          <label className="font-semibold">Skills I Want</label>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              name="wantInput"
              value={formData.wantInput}
              onChange={handleChange}
              placeholder="Add skill"
              className="border p-2 rounded w-full"
            />
            <button
              className="bg-cyan-500 text-white px-4 rounded"
              onClick={() => addSkill("wantInput")}
              type="button"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skillsWant.map((skill, idx) => (
                <span
                    key={idx}
                    className="px-3 py-1 bg-purple-100 rounded-full text-sm flex items-center gap-1"
                >
                    {skill}
                    <button
                    type="button"
                    className="text-red-600 ml-1"
                    onClick={() => removeSkill("want", idx)}
                    >
                    <i className="ri-close-line"></i>
                    </button>
                </span>
                ))}

          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Save
          </button>
        </div>
      </div>
    </Layoutuser>
  );
};

export default UpdateProfile;
