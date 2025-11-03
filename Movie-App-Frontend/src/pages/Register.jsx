import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { endpoints } from "../api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(endpoints.register, {
        username,
        email,
        password, // Backend will hash the password
      });

      if (response.status === 200 || response.status === 201) {
        alert("Account created successfully! Please login.");
        navigate("/login");
      }
    } catch (error) {
      if (error.response?.data) {
        alert(`Registration failed: ${error.response.data}`);
      } else {
        alert("Registration failed. Please try again.");
      }
      console.error("Registration error:", error);
    }
  };

  return (
    <div>
      <h1 className="text-center text-amber-300 font-extrabold text-5xl mt-20">
        Ready to get started??
      </h1>

      <form
        onSubmit={handleRegister}
        className="bg-amber-300 w-full max-w-md mx-auto p-8 rounded-lg mt-10"
      >
        <img
          src="signup.png"
          width={450}
          height={300}
          className="border-2 border-blue-950 rounded-2xl"
        />

        <h1 className="text-center text-blue-950  font-extrabold text-3xl mt-10">
          Register Now!
        </h1>
        <div className="flex flex-col p-2">
          <input
            className="border-1 my-3 rounded-lg text-lg  bg-white"
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="border-1 my-3 rounded-lg text-lg bg-white"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="border-1 my-3 rounded-lg text-lg bg-white"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className=" hover:bg-gray-500 bg-black text-white text-2xl  w-4/5 mx-auto my-3 rounded-lg "
            type="submit"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
