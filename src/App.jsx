import { useCallback, useEffect, useState, useRef } from "react";
import "./app.css";

function App() {
  const [password, setPassword] = useState("P4$5W0rD!");
  const [length, setLength] = useState(10);
  const [options, setOptions] = useState({
    uppercase: false,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
  const [strength, setStrength] = useState("");
  const [copied, setCopied] = useState(false);
  const [passAvailable, setPassAvailable] = useState(true);

  const passwordRef = useRef(null);
  const lengthSliderRef = useRef(null);

  const calculateStrength = useCallback(() => {
    let score = 0;
    const { uppercase, lowercase, numbers, symbols } = options;

    if (uppercase) score++;
    if (lowercase) score++;
    if (numbers) score++;
    if (symbols) score++;

    if (length >= 12) score += 2;
    else if (length >= 8) score += 1;

    if (score >= 5) return "Strong";
    if (score >= 3) return "Medium";
    return "Weak";
  }, [length, options]);

  useEffect(() => {
    setStrength(calculateStrength());
  }, [password, length, options, calculateStrength]);

  const passwordGenerator = useCallback(() => {
    const charSets = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "`~!@#$%^&*()_+-={}[]",
    };

    let str = Object.entries(options)
      .filter(([_, value]) => value)
      .map(([key, _]) => charSets[key])
      .join("");

    let pass = Array.from({ length }, () => str[Math.floor(Math.random() * str.length)]).join("");

    setPassword(pass);
    setPassAvailable(false);
  }, [length, options]);

  const handleCopy = useCallback(() => {
    passwordRef.current?.select();
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  const handleOptionChange = useCallback((option) => {
    setOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  }, []);

  const styleRangeSlider = useCallback(() => {
    const slider = lengthSliderRef.current;
    if (!slider) return;

    const min = slider.min;
    const max = slider.max;
    const val = slider.value;

    slider.style.backgroundSize = ((val - min) * 100) / (max - min) + '% 100%';
  }, []);

  useEffect(() => {
    styleRangeSlider();
  }, [length, styleRangeSlider]);

  return (
    <div className="w-screen h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-[540px] h-auto flex flex-col items-center">
        <h1 className="text-2xl font-bold text-[#807c92] mb-8">
          Password Generator
        </h1>
        <div className="bg-[#23222a] w-full h-[80px] sm:px-8 px-7 flex items-center justify-between mb-8">
          <span
            className={
              passAvailable
                ? "text-[#54535A] sm:text-3xl text-xl font-bold"
                : "text-[#e7e6eb] sm:text-3xl text-xl font-bold"
            }
          >
            {password}
          </span>
          <div
            className={
              passAvailable
                ? "hidden"
                : "flex justify-center items-center gap-3"
            }
          >
            <span className="text-[#a3ffae] sm:text-lg">{copied ? "Copied" : null}</span>
            <button onClick={handleCopy} className="w-10 h-10 hover:text-white">
              <svg
                width="21"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-[#A4FFAF] hover:fill-white"
              >
                <path d="M20.341 3.091 17.909.659A2.25 2.25 0 0 0 16.319 0H8.25A2.25 2.25 0 0 0 6 2.25V4.5H2.25A2.25 2.25 0 0 0 0 6.75v15A2.25 2.25 0 0 0 2.25 24h10.5A2.25 2.25 0 0 0 15 21.75V19.5h3.75A2.25 2.25 0 0 0 21 17.25V4.682a2.25 2.25 0 0 0-.659-1.591ZM12.469 21.75H2.53a.281.281 0 0 1-.281-.281V7.03a.281.281 0 0 1 .281-.281H6v10.5a2.25 2.25 0 0 0 2.25 2.25h4.5v1.969a.282.282 0 0 1-.281.281Zm6-4.5H8.53a.281.281 0 0 1-.281-.281V2.53a.281.281 0 0 1 .281-.281H13.5v4.125c0 .621.504 1.125 1.125 1.125h4.125v9.469a.282.282 0 0 1-.281.281Zm.281-12h-3v-3h.451c.075 0 .147.03.2.082L18.667 4.6a.283.283 0 0 1 .082.199v.451Z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="w-full h-auto bg-[#23222a]">
          <div className="flex justify-between">
            <span className="text-[#e7e6eb] px-8 py-7 text-lg">
              Character Length
            </span>
            <span className="px-8 pt-7 text-3xl text-[#a3ffae] font-bold">
              {length}
            </span>
          </div>
          <div className="px-8">
            <input
              type="range"
              min={5}
              max={20}
              value={length}
              className="char-length-slider"
              onChange={(e) => {
                setLength(e.target.value);
              }}
              ref={lengthSliderRef}
            />
          </div>
          <div className="px-8">
            {Object.entries(options).map(([option, value]) => (
              <div key={option} className="flex items-center gap-x-1">
                <input
                  type="checkbox"
                  checked={value}
                  id={option}
                  className="mb-5"
                  onChange={() => handleOptionChange(option)}
                />
                <label
                  htmlFor={option}
                  className="sm:text-lg text-[#e7e6eb] font-bold px-5 mb-5"
                >
                  Include {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              </div>
            ))}
          </div>
          <div className="bg-[#191820] my-3 mx-8 px-8 h-[72px] flex justify-between items-center">
            <span className="text-[#807c92] sm:text-xl font-bold">
              STRENGTH
            </span>
            <div className="flex gap-2 justify-center items-center">
              <span className="text-[#e7e6eb] sm:text-2xl font-bold">
                {strength}
              </span>
            </div>
          </div>
          <button
            className="bg-[#a3ffae] sm:mx-8 mx-8 my-5 px-5 py-4 sm:w-[475px] w-[334px] flex justify-center items-center gap-5 rounded-md"
            onClick={passwordGenerator}
          >
            <span className="text-[#23222a] sm:text-lg font-bold">
              GENERATE
            </span>
            <svg
              width="12"
              height="12"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fill="#24232C"
                d="m5.106 12 6-6-6-6-1.265 1.265 3.841 3.84H.001v1.79h7.681l-3.841 3.84z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
