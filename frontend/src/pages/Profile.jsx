import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Profile() {

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    location: "",
    tenth_percent: "",
    tenth_board: "",
    twelfth_percent: "",
    twelfth_board: "",
    degree: "",
    degree_percent: "",
    skills: "",
    linkedin: "",
    github: "",
    activities: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const saveProfile = async () => {
    await axios.post("http://127.0.0.1:5000/save_profile", {
      ...form,
      user_id: 1
    });

    alert("Profile Saved Successfully");
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <div className="p-8 flex-1">

          <h2 className="text-2xl font-bold mb-6">
            My Profile
          </h2>

          <div className="bg-white p-6 rounded shadow grid grid-cols-2 gap-4">

            <input name="full_name" placeholder="Full Name" className="border p-2" onChange={handleChange} />
            <input name="phone" placeholder="Phone" className="border p-2" onChange={handleChange} />
            <input name="location" placeholder="Location" className="border p-2" onChange={handleChange} />

            <input name="tenth_percent" placeholder="10th %" className="border p-2" onChange={handleChange} />
            <input name="tenth_board" placeholder="10th Board (ICSE/CBSE)" className="border p-2" onChange={handleChange} />

            <input name="twelfth_percent" placeholder="12th %" className="border p-2" onChange={handleChange} />
            <input name="twelfth_board" placeholder="12th Board" className="border p-2" onChange={handleChange} />

            <input name="degree" placeholder="Degree (B.Tech, Diploma)" className="border p-2" onChange={handleChange} />
            <input name="degree_percent" placeholder="Degree %" className="border p-2" onChange={handleChange} />

            <input name="skills" placeholder="Skills (comma separated)" className="border p-2 col-span-2" onChange={handleChange} />

            <input name="linkedin" placeholder="LinkedIn URL" className="border p-2 col-span-2" onChange={handleChange} />
            <input name="github" placeholder="GitHub URL" className="border p-2 col-span-2" onChange={handleChange} />

            <textarea name="activities" placeholder="Extra Activities" className="border p-2 col-span-2" onChange={handleChange}></textarea>

          </div>

          <button
            onClick={saveProfile}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded"
          >
            Save Profile
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;