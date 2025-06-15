import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // 회원가입용 이름
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleAuth = async () => {
    setError("");
    setMessage("");

    if (isSignUp) {
      // 회원가입
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }, // user_metadata 저장
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("회원가입 완료! 이메일을 확인해주세요.");
        setIsSignUp(false);
      }
    } else {
      // 로그인
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h1 className="text-xl font-bold text-center text-[#1A1B35]">
          {isSignUp ? "회원가입" : "로그인"}
        </h1>

        {isSignUp && (
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg outline-none text-sm"
          />
        )}

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg outline-none text-sm"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg outline-none text-sm"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}

        <button
          onClick={handleAuth}
          className="w-full py-2 bg-[#1A1B35] text-white rounded-lg font-semibold hover:bg-[#2A2B45] transition"
        >
          {isSignUp ? "회원가입" : "로그인"}
        </button>

        <div className="text-center text-sm mt-2">
          {isSignUp ? (
            <>
              계정이 있으신가요?{" "}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-[#1A1B35] font-medium underline"
              >
                로그인
              </button>
            </>
          ) : (
            <>
              아직 계정이 없으신가요?{" "}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-[#1A1B35] font-medium underline"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
