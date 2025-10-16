// import React, { useState } from "react";
// import { supabase } from "../supabaseClient";


// export default function LoginPage({ onLogin }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [error, setError] = useState("");

//   // ===== XỬ LÝ ĐĂNG NHẬP =====
//   async function handleLogin(e) {
//     e.preventDefault();
//     setError("");
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
//     if (error) setError(error.message);
//     else {
//       await ensureUserExists(data.user);
//       onLogin(data.user);
//     }
//   }

//   // ===== XỬ LÝ ĐĂNG KÝ =====
//   async function handleSignUp(e) {
//     e.preventDefault();
//     setError("");
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//     });
//     if (error) setError(error.message);
//     else {
//       // Khi người dùng mới tạo tài khoản, lưu vào bảng users
//       await supabase.from("users").insert([
//         {
//           id: data.user.id,
//           name: name || email.split("@")[0],
//           email: email,
//         },
//       ]);
//       onLogin(data.user);
//     }
//   }

//   // ===== ĐĂNG NHẬP GOOGLE =====
//   async function handleGoogleLogin() {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: { redirectTo: window.location.origin },
//     });
//     if (error) setError(error.message);
//   }

//   // ===== KIỂM TRA NGƯỜI DÙNG ĐÃ TỒN TẠI CHƯA =====
//   async function ensureUserExists(user) {
//     if (!user) return;
//     const { data } = await supabase
//       .from("users")
//       .select("id")
//       .eq("id", user.id)
//       .single();

//     if (!data) {
//       await supabase.from("users").insert([
//         {
//           id: user.id,
//           name: user.email.split("@")[0],
//           email: user.email,
//         },
//       ]);
//     }
//   }

//   return (
//     <div className="login-container">
//       <h2>{isSignUp ? "Đăng ký tài khoản" : "Đăng nhập hệ thống"}</h2>

//       <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
//         {isSignUp && (
//           <input
//             type="text"
//             placeholder="Tên hiển thị"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         )}
//         <input
//           type="email"
//           placeholder="Email..."
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Mật khẩu..."
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button type="submit">{isSignUp ? "Đăng ký" : "Đăng nhập"}</button>
//       </form>

//       <button onClick={handleGoogleLogin}>Đăng nhập bằng Google</button>

//       <p style={{ marginTop: "10px" }}>
//         {isSignUp ? (
//           <>
//             Đã có tài khoản?{" "}
//             <span className="link" onClick={() => setIsSignUp(false)}>
//               Đăng nhập
//             </span>
//           </>
//         ) : (
//           <>
//             Chưa có tài khoản?{" "}
//             <span className="link" onClick={() => setIsSignUp(true)}>
//               Đăng ký
//             </span>
//           </>
//         )}
//       </p>

//       {error && <p className="error">{error}</p>}
//     </div>
//   );
// }
